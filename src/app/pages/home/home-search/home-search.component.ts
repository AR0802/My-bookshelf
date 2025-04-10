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
	notFoundMessage = signal<string>('');
	categories: string[] = [
		'Engineering',
		'Medical',
		'Programming',
		'Science',
		'Self-development',
	];

	constructor() {
		const authorBooks: IBook[] =
			this.router.getCurrentNavigation()?.extras.state?.['items'];
		if (authorBooks && !authorBooks.length) {
			this.notFoundMessage.set('Nothing Found!');
		} else if (authorBooks?.length) {
			this.notFoundMessage.set('');
			this.books.set(authorBooks);
		}

		effect(() => {
			if (this.foundBooks() && !this.foundBooks()?.length) {
				this.notFoundMessage.set('Nothing Found!');
			} else if (this.foundBooks()?.length) {
				this.notFoundMessage.set('');
				this.books.set(this.foundBooks()!);
			}
		});
	}

	searchByCategory(category: string): void {
		this.booksService.getBooks(category).subscribe((books: IResponse) => {
			if (!books.items.length) {
				this.notFoundMessage.set('Nothing Found!');
			} else {
				this.notFoundMessage.set('');
				this.books.set(books.items);
			}
		});
	}
}
