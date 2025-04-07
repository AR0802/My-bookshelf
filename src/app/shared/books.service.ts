import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { IResponse } from './response.interface';
import { environment } from '../../environments/environment';

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
}
