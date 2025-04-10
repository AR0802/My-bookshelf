import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IBook } from '@shared/book.interface';
import { FavoriteBookComponent } from './favorite-book/favorite-book.component';

@Component({
	selector: 'app-favorite-books',
	imports: [FavoriteBookComponent],
	templateUrl: './favorite-books.component.html',
	styleUrl: './favorite-books.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteBooksComponent {
	books = input.required<IBook[]>();
}
