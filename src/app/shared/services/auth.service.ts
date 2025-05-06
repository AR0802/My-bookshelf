import { inject, Injectable, signal } from '@angular/core';
import {
	Auth,
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	updateProfile,
	user,
	UserCredential,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

import { IUser } from '@shared/interfaces';
import {
	EMAIL_IN_USER_ERROR,
	INVALID_CREDENTIAL_ERROR,
	TOO_MANY_REQUEST_ERROR,
} from '@shared/constants/firebase-errors.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
	currentUserSig = signal<IUser | null | undefined>(undefined);
	private firebaseAuth = inject(Auth);
	user$ = user(this.firebaseAuth);

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

	loginWithGoogle(): Observable<UserCredential> {
		return from(signInWithPopup(this.firebaseAuth, new GoogleAuthProvider()));
	}

	updateName(name: string): Observable<void> {
		return from(
			updateProfile(this.firebaseAuth.currentUser!, { displayName: name })
		);
	}

	handleError(error: Error): string {
		if (error.message === INVALID_CREDENTIAL_ERROR) {
			return 'Invalid login or password!';
		} else if (error.message === EMAIL_IN_USER_ERROR) {
			return 'Such email already exists!';
		} else if (error.message === TOO_MANY_REQUEST_ERROR) {
			return 'Too many requests, try later!';
		} else {
			return error.message;
		}
	}
}
