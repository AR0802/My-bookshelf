import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	effect,
	inject,
	OnInit,
	signal,
	untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';

import { BooksContainerComponent } from '@components/books-container/books-container.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { BooksApiService } from '@shared/services/books-api.service';
import { BooksService } from '@shared/services/books.service';
import { IBook, IResponse } from '@shared/interfaces';
import { InteractionService } from '@shared/services/interaction.service';

@Component({
	selector: 'app-home-search',
	imports: [BooksContainerComponent, PaginationComponent],
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
	homeBooks = signal<IBook[]>([]);
	authorBooks = signal<IBook[] | undefined>(undefined);
	notFoundMessage = signal<string>('');
	private router = inject(Router);
	private booksApiService = inject(BooksApiService);
	private booksService = inject(BooksService);
	private destroyRef = inject(DestroyRef);
	private interactionService = inject(InteractionService);

	constructor() {
		this.authorBooks.set(
			this.router.getCurrentNavigation()?.extras.state?.['items']
		);
		this.homeBooks.set(
			this.router.getCurrentNavigation()?.extras.state?.['homeBooks']
		);

		effect(() => {
			if (this.booksService.searchBooks()) {
				if (
					this.booksService.foundBooks() &&
					!this.booksService.foundBooks()?.length
				) {
					this.notFoundMessage.set($localize`Nothing Found!`);
				} else if (this.booksService.foundBooks()?.length) {
					this.notFoundMessage.set('');
					this.booksService.books.set(this.booksService.foundBooks()!);
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
		this.setupBooks();
	}

	private setupBooks(): void {
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

		if (this.booksService.showHomeBooks()) {
			this.booksService.books.set(this.homeBooks());
			this.books.set(this.booksService.books());
			this.booksForPage.set(this.booksService.books().slice(0, 10));
			this.booksService.showHomeBooks.set(false);
		}

		if (!this.booksForPage().length) {
			this.booksForPage.set(this.booksService.books().slice(0, 10));
			this.books.set(this.booksService.books());
		}
	}

	searchByCategory(category: string): void {
		this.booksApiService
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
					this.interactionService.setError(error.message);
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
		this.interactionService.layoutRef()?.nativeElement?.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	}
}
