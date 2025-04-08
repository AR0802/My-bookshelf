import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	signal,
	WritableSignal,
} from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';

import { SearchBooksComponent } from '@components/search-books/search-books.component';
import { BooksService } from '@shared/books.service';
import { IResponse } from '@shared/response.interface';
import { IBook } from '@shared/book.interface';

@Component({
	selector: 'app-home-search',
	imports: [SearchBooksComponent],
	templateUrl: './home-search.component.html',
	styleUrl: './home-search.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeSearchComponent {
	categories: string[] = [
		'Engineering',
		'Medical',
		'Programming',
		'Science',
		'Self-development',
	];
	private booksService = inject(BooksService);
	readonly foundBooks =
		inject<WritableSignal<IBook[] | undefined>>(ROUTER_OUTLET_DATA);
	books = signal<IBook[]>([]);

	constructor() {
		effect(() => {
			if (this.foundBooks()) {
				this.books.set(this.foundBooks()!);
			}
		});
	}

	searchByCategory(category: string): void {
		this.booksService.getBooks(category).subscribe((books: IResponse) => {
			this.books.set(books.items);
		});
	}
}
