import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Book } from './book.model';

@Injectable({ providedIn: 'root' })
export class BooksService {
	constructor(private http: HttpClient) {}

	getProgrammingBooks(): Observable<{ items: Book[] }> {
		return this.http.get<{ items: Book[] }>(
			`https://www.googleapis.com/books/v1/volumes?q=programming&key=AIzaSyAEuXXQbrD-5Tn6l74d65KaoH3J45C-4Z4`
		);
	}

	getScienceBooks(): Observable<{ items: Book[] }> {
		return this.http.get<{ items: Book[] }>(
			`https://www.googleapis.com/books/v1/volumes?q=science&key=AIzaSyAEuXXQbrD-5Tn6l74d65KaoH3J45C-4Z4`
		);
	}

	getSportBooks(): Observable<{ items: Book[] }> {
		return this.http.get<{ items: Book[] }>(
			`https://www.googleapis.com/books/v1/volumes?q=sport&key=AIzaSyAEuXXQbrD-5Tn6l74d65KaoH3J45C-4Z4`
		);
	}

	getSelfDevelopmentBooks(): Observable<{ items: Book[] }> {
		return this.http.get<{ items: Book[] }>(
			`https://www.googleapis.com/books/v1/volumes?q=self-development&key=AIzaSyAEuXXQbrD-5Tn6l74d65KaoH3J45C-4Z4`
		);
	}
}
