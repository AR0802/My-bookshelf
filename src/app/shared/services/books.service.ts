import { ElementRef, inject, Injectable, signal } from '@angular/core';
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
import { GOOGLE_BOOKS_API_URL } from '@shared/constants/google-books-api-url.constant';

@Injectable({ providedIn: 'root' })
export class BooksService {
	homeBooks = new Map();
	books = signal<IBook[]>([]);
	searchBooks = signal<boolean>(false);
	searchAuthorBooks = signal<boolean>(false);
	layoutRef = signal<ElementRef | undefined>(undefined);
	private http = inject(HttpClient);
	private firestore = inject(Firestore);
	private booksCollection = collection(this.firestore, 'books');

	getBooks(category: string): Observable<IResponse> {
		return this.http.get<IResponse>(
			`${GOOGLE_BOOKS_API_URL}?q=${category}&maxResults=40&key=${environment.googleBooksApi.apiKey}`
		);
	}

	getBooksBySearch(
		searchParam: string,
		searchValue: string
	): Observable<IResponse> {
		return this.http.get<IResponse>(
			`${GOOGLE_BOOKS_API_URL}?q= +${searchParam}:${searchValue}&maxResults=40&key=${environment.googleBooksApi.apiKey}`
		);
	}

	getBook(id: string): Observable<IBook> {
		return this.http.get<IBook>(
			`${GOOGLE_BOOKS_API_URL}/${id}?key=${environment.googleBooksApi.apiKey}`
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
