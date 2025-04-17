import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	OnDestroy,
	OnInit,
	signal,
} from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { BooksService } from '@shared/books.service';
import { IBook } from '@shared/book.interface';
import { IResponse } from '@shared/response.interface';
import { ERoutes } from '@shared/routes.enum';
import { LoaderComponent } from '@components/loader/loader.component';

@Component({
	selector: 'app-home-book',
	imports: [LoaderComponent],
	templateUrl: './home-book.component.html',
	styleUrl: './home-book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeBookComponent implements OnInit, OnDestroy {
	private location = inject(Location);
	private router = inject(Router);
	private activatedRoute = inject(ActivatedRoute);
	private booksService = inject(BooksService);
	private subscription: Subscription | undefined;
	id: string | undefined;
	book = signal<IBook | undefined>(undefined);
	authorBooks = signal<IBook[]>([]);
	haveAuthorBooks = signal<boolean>(false);

	constructor() {
		effect(() => {
			if (this.book()?.volumeInfo.authors) {
				this.haveAuthorBooks.set(true);
				this.booksService
					.getBooksBySearch(
						'inauthor',
						this.book()?.volumeInfo.authors[0] as string
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

	ngOnInit(): void {
		this.subscription = this.activatedRoute.params.subscribe(
			(params: Params) => {
				this.id = params['id'];
				this.booksService.getBook(this.id!).subscribe((book: IBook) => {
					this.book.set(book);
				});
			}
		);
	}

	backClicked(): void {
		this.location.back();
	}

	searchByAuthor(): void {
		this.booksService
			.getBooksBySearch(
				'inauthor',
				this.book()?.volumeInfo.authors[0] as string
			)
			.subscribe((data: IResponse) => {
				this.router.navigateByUrl(ERoutes.search, { state: data });
			});
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}
}
