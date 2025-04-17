import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	signal,
	untracked,
	WritableSignal,
} from '@angular/core';
import { Router, ROUTER_OUTLET_DATA } from '@angular/router';

import { SearchBooksComponent } from '@components/search-books/search-books.component';
import { BooksService } from '@shared/books.service';
import { IResponse } from '@shared/response.interface';
import { IBook } from '@shared/book.interface';
import { PaginationComponent } from '@components/pagination/pagination.component';

@Component({
	selector: 'app-home-search',
	imports: [SearchBooksComponent, PaginationComponent],
	templateUrl: './home-search.component.html',
	styleUrl: './home-search.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeSearchComponent {
	booksService = inject(BooksService);
	private router = inject(Router);
	readonly foundBooks =
		inject<WritableSignal<IBook[] | undefined>>(ROUTER_OUTLET_DATA);
	booksForPage = signal<IBook[]>([]);
	notFoundMessage = signal<string>('');
	categories: string[] = [
		$localize`Engineering`,
		$localize`Medical`,
		$localize`Programming`,
		$localize`Science`,
		$localize`Self-development`,
	];

	constructor() {
		const authorBooks: IBook[] =
			this.router.getCurrentNavigation()?.extras.state?.['items'];
		if (authorBooks && !authorBooks.length) {
			this.notFoundMessage.set($localize`Nothing Found!`);
		} else if (authorBooks?.length) {
			this.notFoundMessage.set('');
			this.booksService.books.set(authorBooks);
			this.booksForPage.set(this.booksService.books().slice(0, 10));
		}

		effect(() => {
			if (this.foundBooks() && !this.foundBooks()?.length) {
				this.notFoundMessage.set($localize`Nothing Found!`);
			} else if (this.foundBooks()?.length) {
				this.notFoundMessage.set('');
				this.booksService.books.set(this.foundBooks()!);
				untracked(() => {
					this.booksForPage.set(this.booksService.books().slice(0, 10));
				});
			}
		});

		if (!this.booksForPage().length) {
			this.booksForPage.set(this.booksService.books().slice(0, 10));
		}
	}

	searchByCategory(category: string): void {
		this.booksService.getBooks(category).subscribe((books: IResponse) => {
			if (!books.items.length) {
				this.notFoundMessage.set($localize`Nothing Found!`);
			} else {
				this.notFoundMessage.set('');
				this.booksService.books.set(books.items);
				this.booksForPage.set(this.booksService.books().slice(0, 10));
			}
		});
	}

	pageChanged(pageNumber: number): void {
		this.booksForPage.set(
			this.booksService.books().slice((pageNumber - 1) * 10, pageNumber * 10)
		);
		this.booksService.layoutRef()?.nativeElement?.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}
}
