import { ElementRef, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { IResponse } from './response.interface';
import { IBook } from './book.interface';

@Injectable({ providedIn: 'root' })
export class BooksService {
	private http = inject(HttpClient);
	books = signal<IBook[]>([]);
	homeBooks = new Map();
	layoutRef = signal<ElementRef | undefined>(undefined);

	getBooks(category: string): Observable<IResponse> {
		return this.http.get<IResponse>(
			`https://www.googleapis.com/books/v1/volumes?q=${category}&maxResults=40&key=${environment.googleBooksApi.apiKey}`
		);
	}

	getBooksBySearch(
		searchParam: string,
		searchValue: string
	): Observable<IResponse> {
		return this.http.get<IResponse>(
			`https://www.googleapis.com/books/v1/volumes?q= +${searchParam}:${searchValue}&maxResults=40&key=${environment.googleBooksApi.apiKey}`
		);
	}

	getBook(id: string): Observable<IBook> {
		return this.http.get<IBook>(
			`https://www.googleapis.com/books/v1/volumes/${id}?key=${environment.googleBooksApi.apiKey}`
		);
	}
}
