import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	OnInit,
	signal,
} from '@angular/core';
import { Location, SlicePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BooksService } from '@shared/services/books.service';
import { IBook, IResponse } from '@shared/interfaces';
import { ERoutes } from '@shared/enums/routes.enum';
import { LoaderComponent } from '@ui-components/loader/loader.component';
import { AlertComponent } from '@ui-components/alert/alert.component';

@Component({
	selector: 'app-home-book',
	imports: [LoaderComponent, AlertComponent, SlicePipe],
	templateUrl: './home-book.component.html',
	styleUrl: './home-book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeBookComponent implements OnInit {
	id = signal<string | undefined>(undefined);
	book = signal<IBook | undefined>(undefined);
	authorBooks = signal<IBook[]>([]);
	haveAuthorBooks = signal<boolean>(false);
	separator = signal<string>('');
	error = signal<string>('');
	private location = inject(Location);
	private router = inject(Router);
	private activatedRoute = inject(ActivatedRoute);
	private booksService = inject(BooksService);
	private destroyRef = inject(DestroyRef);

	ngOnInit(): void {
		this.activatedRoute.params
			.pipe(
				tap((params: Params) => {
					this.id.set(params['id']);
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe(() => {
				this.booksService
					.getBook(this.id()!)
					.pipe(
						catchError((error: Error) => {
							this.error.set(error.message);
							return EMPTY;
						}),
						takeUntilDestroyed(this.destroyRef)
					)
					.subscribe((book: IBook) => {
						this.book.set(book);
						if (this.book()?.volumeInfo.authors) {
							if (this.book()?.volumeInfo?.publishedDate) {
								this.separator.set(', ');
							}
							this.haveAuthorBooks.set(true);
							this.booksService
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
										this.error.set(error.message);
										return EMPTY;
									}),
									takeUntilDestroyed(this.destroyRef)
								)
								.subscribe();
						}
					});
			});
	}

	back(): void {
		this.location.back();
	}

	searchByAuthor(): void {
		this.booksService
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
					this.error.set(error.message);
					return EMPTY;
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}
}
