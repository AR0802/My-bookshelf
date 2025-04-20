import { Component, OnInit, signal } from '@angular/core';

import { FavoriteBooksComponent } from '@components/favorite-books/favorite-books.component';
import { IBook } from '@shared/interfaces';

@Component({
	selector: 'app-home-favorite',
	imports: [FavoriteBooksComponent],
	templateUrl: './home-favorites.component.html',
	styleUrl: './home-favorites.component.scss',
})
export default class HomeFavoriteComponent implements OnInit {
	books = signal<IBook[]>([]);

	ngOnInit(): void {
		const favoriteBooks: IBook[] = [];
		for (let i = 0; i < localStorage.length; i++) {
			favoriteBooks.push(
				JSON.parse(
					localStorage.getItem(localStorage.key(i) as string) as string
				)
			);
		}
		this.books.set(favoriteBooks);
	}
}
