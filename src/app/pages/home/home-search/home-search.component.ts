import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	signal,
	WritableSignal,
} from '@angular/core';
import { Router, ROUTER_OUTLET_DATA } from '@angular/router';

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
	private booksService = inject(BooksService);
	private router = inject(Router);
	readonly foundBooks =
		inject<WritableSignal<IBook[] | undefined>>(ROUTER_OUTLET_DATA);
	books = signal<IBook[]>([]);
	categories: string[] = [
		'Engineering',
		'Medical',
		'Programming',
		'Science',
		'Self-development',
	];

	constructor() {
		this.books.set(this.router.getCurrentNavigation()?.extras.state?.['items']);
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
