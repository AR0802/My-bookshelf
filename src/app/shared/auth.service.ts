import { inject, Injectable, signal } from '@angular/core';
import {
	Auth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
	user,
	UserCredential,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

import { IUser } from './user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private firebaseAuth = inject(Auth);
	user$ = user(this.firebaseAuth);
	currentUserSig = signal<IUser | null | undefined>(undefined);

	signup(name: string, email: string, password: string): Observable<void> {
		const promise = createUserWithEmailAndPassword(
			this.firebaseAuth,
			email,
			password
		).then((response) => updateProfile(response.user, { displayName: name }));
		return from(promise);
	}

	login(email: string, password: string): Observable<UserCredential> {
		const promise = signInWithEmailAndPassword(
			this.firebaseAuth,
			email,
			password
		);
		return from(promise);
	}

	logout(): Observable<void> {
		return from(signOut(this.firebaseAuth));
	}
}
