import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	input,
	OnInit,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs';

import { BooksApiService } from '@shared/services/books-api.service';
import { IBook, IResponse } from '@shared/interfaces';
import { InteractionService } from '@shared/services/interaction.service';
import { BooksService } from '@shared/services/books.service';
import { ERoutes } from '@shared/enums/routes.enum';
import { BookComponent } from './book/book.component';

@Component({
	selector: 'app-books',
	imports: [BookComponent],
	templateUrl: './books.component.html',
	styleUrl: './books.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent implements OnInit {
	category = input.required<string>();
	books = signal<IBook[]>([]);
	private booksApiService = inject(BooksApiService);
	private booksService = inject(BooksService);
	private interactionService = inject(InteractionService);
	private destroyRef = inject(DestroyRef);
	private router = inject(Router);

	ngOnInit(): void {
		this.getBooks();
	}

	private getBooks(): void {
		this.interactionService.showLoader.set(!this.books().length);
		if (!this.booksService.homeBooks.size) {
			this.booksApiService
				.getBooks(this.category())
				.pipe(
					tap((data: IResponse) => {
						this.books.set(data.items.slice(0, 5));
						this.booksService.homeBooks.set(this.category(), data.items);
						this.interactionService.showLoader.set(!this.books().length);
					}),
					catchError(() => {
						return [];
					}),
					takeUntilDestroyed(this.destroyRef)
				)
				.subscribe();
		} else {
			this.books.set(
				this.booksService.homeBooks.get(this.category()).slice(0, 5)
			);
			this.interactionService.showLoader.set(!this.books().length);
		}
	}

	showAll(): void {
		this.booksService.showHomeBooks.set(true);
		this.router.navigateByUrl(`/${ERoutes.BOOKS}/${ERoutes.SEARCH}`, {
			state: { homeBooks: this.booksService.homeBooks.get(this.category()) },
		});
	}
}
