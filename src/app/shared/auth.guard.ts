import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
	private router = inject(Router);

	canActivate():
		| boolean
		| UrlTree
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree> {
		const isAuth = true;
		if (isAuth) {
			return true;
		}
		return this.router.createUrlTree(['/login']);
	}
}
