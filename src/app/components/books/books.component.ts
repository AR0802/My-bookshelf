import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	OnInit,
	output,
	signal,
} from '@angular/core';

import { BooksService } from '@shared/services/books.service';
import { IBook, IResponse } from '@shared/interfaces';
import { BookComponent } from './book/book.component';
import { catchError, tap } from 'rxjs';

@Component({
	selector: 'app-books',
	imports: [BookComponent],
	templateUrl: './books.component.html',
	styleUrl: './books.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent implements OnInit {
	category = input.required<string>();
	booksOutput = output<IBook[]>();
	books = signal<IBook[]>([]);
	private booksService = inject(BooksService);

	ngOnInit(): void {
		if (!this.booksService.homeBooks.size) {
			this.booksService
				.getBooks(this.category())
				.pipe(
					tap((data: IResponse) => {
						this.books.set(data.items.slice(0, 5));
						this.booksOutput.emit(this.books());
						this.booksService.homeBooks.set(this.category(), data.items);
					}),
					catchError(() => {
						return [];
					})
				)
				.subscribe();
		} else {
			this.books.set(
				this.booksService.homeBooks.get(this.category()).slice(0, 5)
			);
			this.booksOutput.emit(this.books());
		}
	}
}
