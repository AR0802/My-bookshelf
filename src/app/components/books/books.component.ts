import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	OnInit,
	signal,
} from '@angular/core';

import { BooksService } from '@shared/books.service';
import { IBook } from '@shared/book.interface';
import { IResponse } from '@shared/response.interface';
import { BookComponent } from './book/book.component';

@Component({
	selector: 'app-books',
	imports: [BookComponent],
	templateUrl: './books.component.html',
	styleUrl: './books.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent implements OnInit {
	private booksService = inject(BooksService);
	books = signal<IBook[]>([]);
	category = input.required<string>();

	ngOnInit(): void {
		if (!this.booksService.homeBooks.size) {
			this.booksService
				.getBooks(this.category())
				.subscribe((data: IResponse) => {
					this.books.set(data.items.slice(0, 5));
					this.booksService.homeBooks.set(this.category(), data.items);
				});
		} else {
			this.books.set(
				this.booksService.homeBooks.get(this.category()).slice(0, 5)
			);
		}
	}
}
