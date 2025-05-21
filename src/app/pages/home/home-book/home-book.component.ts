import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	effect,
	inject,
	OnInit,
	signal,
} from '@angular/core';
import { Location, SlicePipe } from '@angular/common';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BooksApiService } from '@shared/services/books-api.service';
import { BooksService } from '@shared/services/books.service';
import { IBook, IResponse } from '@shared/interfaces';
import { ERoutes } from '@shared/enums/routes.enum';
import { SeparatorPipe } from '@shared/pipes/separator.pipe';
import { InteractionService } from '@shared/services/interaction.service';

@Component({
	selector: 'app-home-book',
	imports: [RouterLink, SlicePipe, SeparatorPipe],
	templateUrl: './home-book.component.html',
	styleUrl: './home-book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeBookComponent implements OnInit {
	readonly ERoutes = ERoutes;
	book = signal<IBook | undefined>(undefined);
	authorBooks = signal<IBook[]>([]);
	haveAuthorBooks = signal<boolean>(false);
	private location = inject(Location);
	private router = inject(Router);
	private activatedRoute = inject(ActivatedRoute);
	private booksService = inject(BooksService);
	private booksApiService = inject(BooksApiService);
	private destroyRef = inject(DestroyRef);
	private interactionService = inject(InteractionService);

	constructor() {
		effect(() => {
			this.interactionService.showLoader.set(
				!this.book() || (this.haveAuthorBooks() && !this.authorBooks().length)
			);
		});
	}

	ngOnInit(): void {
		this.getIdAndBook();
	}

	private getIdAndBook(): void {
		this.activatedRoute.params
			.pipe(
				switchMap((params: Params) =>
					this.booksApiService.getBook(params['id'])
				),
				catchError((error: Error) => {
					this.interactionService.setError(error.message);
					return EMPTY;
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((book: IBook) => {
				this.book.set(book);
				this.setAuthorBooks();
			});
	}

	private setAuthorBooks(): void {
		if (this.book()?.volumeInfo.authors) {
			this.haveAuthorBooks.set(true);
			this.booksApiService
				.getBooksBySearch(
					'inauthor',
					this.book()?.volumeInfo.authors[0] as string
				)
				.pipe(
					tap((data: IResponse) => {
						if (data.items) {
							const filteredBooks = data.items.filter((book: IBook) => {
								if (
									this.book()?.id === book.id ||
									!book.volumeInfo.imageLinks
								) {
									return false;
								}
								return true;
							});
							if (!filteredBooks.length) {
								this.haveAuthorBooks.set(false);
							} else {
								this.authorBooks.set(filteredBooks.slice(0, 3));
							}
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
	}

	back(): void {
		this.location.back();
	}

	searchByAuthor(): void {
		this.booksApiService
			.getBooksBySearch(
				'inauthor',
				this.book()?.volumeInfo.authors[0] as string
			)
			.pipe(
				tap((data: IResponse) => {
					this.booksService.searchAuthorBooks.set(true);
					this.router.navigateByUrl(`/${ERoutes.BOOKS}/${ERoutes.SEARCH}`, {
						state: data,
					});
				}),
				catchError((error: Error) => {
					this.interactionService.setError(error.message);
					return EMPTY;
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}
}
