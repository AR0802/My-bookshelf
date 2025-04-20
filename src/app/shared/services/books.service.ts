import { ElementRef, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { IBook, IResponse } from '@shared/interfaces';
import { googleBooksAPIUrl } from '@shared/constants/googleBooksAPIUrl.constant';

@Injectable({ providedIn: 'root' })
export class BooksService {
	homeBooks = new Map();
	books = signal<IBook[]>([]);
	searchBooks = signal<boolean>(false);
	searchAuthorBooks = signal<boolean>(false);
	layoutRef = signal<ElementRef | undefined>(undefined);
	private http = inject(HttpClient);

	getBooks(category: string): Observable<IResponse> {
		return this.http.get<IResponse>(
			`${googleBooksAPIUrl}?q=${category}&maxResults=40&key=${environment.googleBooksApi.apiKey}`
		);
	}

	getBooksBySearch(
		searchParam: string,
		searchValue: string
	): Observable<IResponse> {
		return this.http.get<IResponse>(
			`${googleBooksAPIUrl}?q= +${searchParam}:${searchValue}&maxResults=40&key=${environment.googleBooksApi.apiKey}`
		);
	}

	getBook(id: string): Observable<IBook> {
		return this.http.get<IBook>(
			`${googleBooksAPIUrl}/${id}?key=${environment.googleBooksApi.apiKey}`
		);
	}
}
