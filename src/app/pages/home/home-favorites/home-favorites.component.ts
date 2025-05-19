import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	signal,
} from '@angular/core';

import { BooksContainerComponent } from '@components/books-container/books-container.component';
import { IBook } from '@shared/interfaces';

@Component({
	selector: 'app-home-favorite',
	imports: [BooksContainerComponent],
	templateUrl: './home-favorites.component.html',
	styleUrl: './home-favorites.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeFavoriteComponent implements OnInit {
	books = signal<IBook[]>([]);

	ngOnInit(): void {
		this.setFavoriteBooks();
	}

	private setFavoriteBooks(): void {
		const favoriteBooks: IBook[] = [];
		for (let i = 0; i < localStorage.length; i++) {
			if (
				JSON.parse(
					localStorage.getItem(localStorage.key(i) as string) as string
				) instanceof Object
			) {
				favoriteBooks.push(
					JSON.parse(
						localStorage.getItem(localStorage.key(i) as string) as string
					)
				);
			}
		}
		this.books.set(favoriteBooks);
	}
}
