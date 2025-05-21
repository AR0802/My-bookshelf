import { Injectable, signal } from '@angular/core';

import { IBook } from '@shared/interfaces';

@Injectable({ providedIn: 'root' })
export class BooksService {
	homeBooks = new Map();
	books = signal<IBook[]>([]);
	foundBooks = signal<IBook[] | null>(null);
	searchBooks = signal<boolean>(false);
	searchAuthorBooks = signal<boolean>(false);
	showHomeBooks = signal(false);
}
