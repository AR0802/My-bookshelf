import { Routes } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { ERoutes } from '@shared/enums/routes.enum';

const redirectUnauthorizedToLogin = () =>
	redirectUnauthorizedTo(`/${ERoutes.LOGIN}`);

export const routes: Routes = [
	{ path: '', redirectTo: ERoutes.BOOKS, pathMatch: 'full' },
	{
		path: 'books',
		loadComponent: () =>
			import('@pages/home/home.component').then(
				(component) => component.HomeComponent
			),
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectUnauthorizedToLogin },
		children: [
			{
				path: '',
				loadComponent: () =>
					import('@pages/home/home-books/home-books.component').then(
						(component) => component.HomeBooksComponent
					),
			},
			{
				path: 'search',
				loadComponent: () =>
					import('@pages/home/home-search/home-search.component').then(
						(component) => component.HomeSearchComponent
					),
			},
			{
				path: 'favorites',
				loadComponent: () =>
					import('@pages/home/home-favorites/home-favorites.component').then(
						(component) => component.HomeFavoriteComponent
					),
			},
			{
				path: 'upload',
				loadComponent: () =>
					import('@pages/home/home-upload/home-upload.component').then(
						(component) => component.HomeUploadComponent
					),
			},
			{
				path: 'my-books',
				loadComponent: () =>
					import('@pages/home/home-my-books/home-my-books.component').then(
						(component) => component.HomeMyBooksComponent
					),
			},
			{
				path: ':id',
				loadComponent: () =>
					import('@pages/home/home-book/home-book.component').then(
						(component) => component.HomeBookComponent
					),
			},
		],
	},
	{
		path: 'signup',
		loadComponent: () =>
			import('@pages/auth/signup/signup.component').then(
				(component) => component.SignupComponent
			),
	},
	{
		path: 'login',
		loadComponent: () =>
			import('@pages/auth/login/login.component').then(
				(component) => component.LoginComponent
			),
	},
	{
		path: '**',
		loadComponent: () =>
			import('@pages/not-found/not-found.component').then(
				(component) => component.NotFoundComponent
			),
	},
];
