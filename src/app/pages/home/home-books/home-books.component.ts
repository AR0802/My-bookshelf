import {
	ChangeDetectionStrategy,
	Component,
	signal,
} from '@angular/core';

import { BooksComponent } from '@components/books/books.component';
import { LoaderComponent } from '@ui-components/loader/loader.component';
import { IBook } from '@shared/interfaces';

@Component({
	selector: 'app-home-books',
	imports: [BooksComponent, LoaderComponent],
	templateUrl: './home-books.component.html',
	styleUrl: './home-books.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeBooksComponent {
	categories: string[] = [
		$localize`Programming`,
		$localize`Science`,
		$localize`Self-development`,
		$localize`Sport`,
	];
	books = signal<IBook[]>([]);

	protected booksChange(books: IBook[]): void {
		this.books.set(books);
	}
}
