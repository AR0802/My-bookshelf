import { Routes } from '@angular/router';

import { AuthGuard } from './shared/auth.guard';

export const routes: Routes = [
	{ path: '', redirectTo: '/books', pathMatch: 'full' },
	{
		path: 'books',
		loadComponent: () => import('./pages/home/home.component'),
		canActivate: [AuthGuard],
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./pages/home/home-books/home-books.component'),
			},
			{
				path: ':id',
				loadComponent: () =>
					import('./pages/home/home-book/home-book.component'),
			},
		],
	},
	{
		path: 'signup',
		loadComponent: () => import('./pages/auth/signup/signup.component'),
	},
	{
		path: 'login',
		loadComponent: () => import('./pages/auth/login/login.component'),
	},
	{ path: '**', loadComponent: () => import('./pages/not-found.component') },
];
