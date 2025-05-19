import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
	addDoc,
	collection,
	collectionData,
	Firestore,
} from '@angular/fire/firestore';

import { environment } from '@environments/environment';
import { IBook, IResponse, IUserBook } from '@shared/interfaces';

@Injectable({ providedIn: 'root' })
export class BooksApiService {
	private http = inject(HttpClient);
	private firestore = inject(Firestore);
	private booksCollection = collection(this.firestore, 'books');

	getBooks(category: string): Observable<IResponse> {
		return this.http.get<IResponse>(
			`${environment.googleBooksApi.url}?q=${category}&maxResults=40&key=${environment.googleBooksApi.apiKey}`
		);
	}

	getBooksBySearch(
		searchParam: string,
		searchValue: string
	): Observable<IResponse> {
		return this.http.get<IResponse>(
			`${environment.googleBooksApi.url}?q= +${searchParam}:${searchValue}&maxResults=40&key=${environment.googleBooksApi.apiKey}`
		);
	}

	getBook(id: string): Observable<IBook> {
		return this.http.get<IBook>(
			`${environment.googleBooksApi.url}/${id}?key=${environment.googleBooksApi.apiKey}`
		);
	}

	getUserBooks(): Observable<IUserBook[]> {
		return collectionData(this.booksCollection, {
			idField: 'id',
		}) as Observable<IUserBook[]>;
	}

	addUserBook(userBook: Omit<IUserBook, 'id'>): Observable<string> {
		return from(
			addDoc(this.booksCollection, userBook).then((response) => response.id)
		);
	}
}
