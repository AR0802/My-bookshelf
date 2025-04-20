import { Routes } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { ERoutes } from '@shared/enums/routes.enum';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(`/${ERoutes.Login}`);

export const routes: Routes = [
	{ path: '', redirectTo: ERoutes.Books, pathMatch: 'full' },
	{
		path: 'books',
		loadComponent: () => import('@pages/home/home.component'),
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectUnauthorizedToLogin },
		children: [
			{
				path: '',
				loadComponent: () =>
					import('@pages/home/home-books/home-books.component'),
			},
			{
				path: 'search',
				loadComponent: () =>
					import('@pages/home/home-search/home-search.component'),
			},
			{
				path: 'favorites',
				loadComponent: () =>
					import('@pages/home/home-favorites/home-favorites.component'),
			},
			{
				path: ':id',
				loadComponent: () =>
					import('@pages/home/home-book/home-book.component'),
			},
		],
	},
	{
		path: 'signup',
		loadComponent: () => import('@pages/auth/signup/signup.component'),
	},
	{
		path: 'login',
		loadComponent: () => import('@pages/auth/login/login.component'),
	},
	{ path: '**', loadComponent: () => import('@pages/not-found/not-found.component') },
];
