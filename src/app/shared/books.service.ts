import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { IResponse } from './response.interface';
import { IBook } from './book.interface';

@Injectable({ providedIn: 'root' })
export class BooksService {
	private http = inject(HttpClient);

	getBooks(category: string): Observable<IResponse> {
		return this.http.get<IResponse>(
			`https://www.googleapis.com/books/v1/volumes?q=${category}&key=${environment.googleBooksApi.apiKey}`
		);
	}

	getBooksBySearch(
		searchParam: string,
		searchValue: string
	): Observable<IResponse> {
		return this.http.get<IResponse>(
			`https://www.googleapis.com/books/v1/volumes?q= +${searchParam}:${searchValue}&key=${environment.googleBooksApi.apiKey}`
		);
	}

	getBook(id: string): Observable<IBook> {
		return this.http.get<IBook>(
			`https://www.googleapis.com/books/v1/volumes/${id}?key=${environment.googleBooksApi.apiKey}`
		);
	}
}
