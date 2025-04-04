import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { IUser } from './user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private firestore = inject(Firestore);
	usersCollection = collection(this.firestore, 'users');

	getUsers(): Observable<IUser> {
		return collectionData(this.usersCollection, {
			idField: 'id',
		}) as unknown as Observable<IUser>;
	}
}
