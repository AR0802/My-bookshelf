import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnDestroy,
	OnInit,
	signal,
} from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { catchError, EMPTY, Subscription } from 'rxjs';

import { BooksService } from '@shared/services/books.service';
import { IBook, IResponse } from '@shared/interfaces';
import { ERoutes } from '@shared/enums/routes.enum';
import { LoaderComponent } from '@components/loader/loader.component';

@Component({
	selector: 'app-home-book',
	imports: [LoaderComponent],
	templateUrl: './home-book.component.html',
	styleUrl: './home-book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeBookComponent implements OnInit, OnDestroy {
	id: string | undefined;
	private subscription: Subscription | undefined;
	book = signal<IBook | undefined>(undefined);
	authorBooks = signal<IBook[]>([]);
	haveAuthorBooks = signal<boolean>(false);
	separator = signal<string>('');
	private location = inject(Location);
	private router = inject(Router);
	private activatedRoute = inject(ActivatedRoute);
	private booksService = inject(BooksService);

	ngOnInit(): void {
		this.subscription = this.activatedRoute.params.subscribe(
			(params: Params) => {
				this.id = params['id'];
				this.booksService
					.getBook(this.id!)
					.pipe(
						catchError(() => {
							return EMPTY;
						})
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
									catchError(() => {
										return EMPTY;
									})
								)
								.subscribe((data: IResponse) => {
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
								});
						}
					});
			}
		);
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
				catchError(() => {
					return EMPTY;
				})
			)
			.subscribe((data: IResponse) => {
				this.booksService.searchAuthorBooks.set(true);
				this.router.navigateByUrl(`/${ERoutes.Books}/${ERoutes.Search}`, {
					state: data,
				});
			});
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}
}
