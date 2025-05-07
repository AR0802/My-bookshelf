import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	effect,
	inject,
	OnInit,
	signal,
	untracked,
	WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';

import { SearchBooksComponent } from '@components/search-books/search-books.component';
import { BooksService } from '@shared/services/books.service';
import { IBook, IResponse } from '@shared/interfaces';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { AlertComponent } from '@ui-components/alert/alert.component';

@Component({
	selector: 'app-home-search',
	imports: [SearchBooksComponent, PaginationComponent, AlertComponent],
	templateUrl: './home-search.component.html',
	styleUrl: './home-search.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeSearchComponent implements OnInit {
	categories: string[] = [
		$localize`Engineering`,
		$localize`Medical`,
		$localize`Programming`,
		$localize`Science`,
		$localize`Self-development`,
	];
	booksForPage = signal<IBook[]>([]);
	books = signal<IBook[]>([]);
	authorBooks = signal<IBook[] | undefined>(undefined);
	notFoundMessage = signal<string>('');
	error = signal<string>('');
	private router = inject(Router);
	private readonly foundBooks =
		inject<WritableSignal<IBook[] | undefined>>(ROUTER_OUTLET_DATA);
	private booksService = inject(BooksService);
	private destroyRef = inject(DestroyRef);

	constructor() {
		this.authorBooks.set(
			this.router.getCurrentNavigation()?.extras.state?.['items']
		);

		effect(() => {
			if (this.booksService.searchBooks()) {
				if (this.foundBooks() && !this.foundBooks()?.length) {
					this.notFoundMessage.set($localize`Nothing Found!`);
				} else if (this.foundBooks()?.length) {
					this.notFoundMessage.set('');
					this.booksService.books.set(this.foundBooks()!);
					untracked(() => {
						this.books.set(this.booksService.books());
						this.booksForPage.set(this.booksService.books().slice(0, 10));
					});
				}
				this.booksService.searchBooks.set(false);
			}
		});
	}

	ngOnInit(): void {
		if (this.booksService.searchAuthorBooks()) {
			if (this.authorBooks() && !this.authorBooks()?.length) {
				this.notFoundMessage.set($localize`Nothing Found!`);
			} else if (this.authorBooks()?.length) {
				this.notFoundMessage.set('');
				this.booksService.books.set(this.authorBooks()!);
				this.books.set(this.booksService.books());
				this.booksForPage.set(this.booksService.books().slice(0, 10));
			}
			this.booksService.searchAuthorBooks.set(false);
		}

		if (!this.booksForPage().length) {
			this.booksForPage.set(this.booksService.books().slice(0, 10));
			this.books.set(this.booksService.books());
		}
	}

	searchByCategory(category: string): void {
		this.booksService
			.getBooks(category)
			.pipe(
				tap((books: IResponse) => {
					if (!books.items.length) {
						this.notFoundMessage.set($localize`Nothing Found!`);
					} else {
						this.notFoundMessage.set('');
						this.booksService.books.set(books.items);
						this.books.set(this.booksService.books());
						this.booksForPage.set(this.booksService.books().slice(0, 10));
					}
				}),
				catchError((error: Error) => {
					this.error.set(error.message);
					return EMPTY;
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}

	pageChange(pageNumber: number): void {
		this.booksForPage.set(
			this.booksService.books().slice((pageNumber - 1) * 10, pageNumber * 10)
		);
		this.booksService.layoutRef()?.nativeElement?.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}
}
