import {
	ChangeDetectionStrategy,
	Component,
	input,
	OnInit,
	signal,
} from '@angular/core';

import { BookComponent } from './book/book.component';
import { BooksService } from '../shared/books.service';
import { Book } from '../shared/book.model';

@Component({
	selector: 'app-books',
	imports: [BookComponent],
	templateUrl: './books.component.html',
	styleUrl: './books.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent implements OnInit {
	books = signal<Book[]>([]);
	category = input<string>();

	constructor(private booksService: BooksService) {}

	ngOnInit(): void {
		if (this.category() === 'Programming') {
			this.booksService
				.getProgrammingBooks()
				.subscribe((data: { items: Book[] }) => {
					this.books.set(data.items.slice(0, 5));
				});
		} else if (this.category() === 'Science') {
			this.booksService
				.getScienceBooks()
				.subscribe((data: { items: Book[] }) => {
					this.books.set(data.items.slice(0, 5));
				});
		} else if (this.category() === 'Sport') {
			this.booksService.getSportBooks().subscribe((data: { items: Book[] }) => {
				this.books.set(data.items.slice(0, 5));
			});
		} else if (this.category() === 'Self-development') {
			this.booksService
				.getSelfDevelopmentBooks()
				.subscribe((data: { items: Book[] }) => {
					this.books.set(data.items.slice(0, 5));
				});
		}
	}
}
