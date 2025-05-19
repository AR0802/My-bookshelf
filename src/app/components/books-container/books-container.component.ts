import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FavoriteBookComponent } from '@components/books-container/favorite-book/favorite-book.component';
import { SearchBookComponent } from '@components/books-container/search-book/search-book.component';
import { UserBookComponent } from '@components/books-container/user-book/user-book.component';
import { IBook, IUserBook } from '@shared/interfaces';
import { BookType } from '@shared/types/book-type.type';

@Component({
	selector: 'app-books-container',
	imports: [FavoriteBookComponent, UserBookComponent, SearchBookComponent],
	templateUrl: './books-container.component.html',
	styleUrl: './books-container.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksContainerComponent {
	books = input.required<IBook[] | IUserBook[]>();
	type = input.required<BookType>();

	isIbook(book: IBook | IUserBook): book is IBook {
		return 'volumeInfo' in book;
	}
}
