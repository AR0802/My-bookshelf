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
import { catchError, tap } from 'rxjs';

import { BooksApiService } from '@shared/services/books-api.service';
import { IBook, IResponse } from '@shared/interfaces';
import { BookComponent } from './book/book.component';
import { InteractionService } from '@shared/services/interaction.service';
import { BooksService } from '@shared/services/books.service';

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
	private destroyRef = inject(DestroyRef);
	private interactionService = inject(InteractionService);

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
}
