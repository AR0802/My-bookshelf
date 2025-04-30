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
}
