import { ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';

import { BooksComponent } from '@components/books/books.component';
import { LoaderComponent } from '@components/loader/loader.component';
import { IBook } from '@shared/book.interface';
import { BooksService } from '@shared/books.service';

@Component({
	selector: 'app-home-books',
	imports: [BooksComponent, LoaderComponent],
	templateUrl: './home-books.component.html',
	styleUrl: './home-books.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeBooksComponent {
	booksService = inject(BooksService);
	books = signal<IBook[]>([]);
	categories: string[] = [
		$localize`Programming`,
		$localize`Science`,
		$localize`Self-development`,
		$localize`Sport`,
	];

	booksChanged(books: IBook[]): void {
		this.books.set(books);
	}
}
