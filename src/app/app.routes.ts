import { Routes } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { ERoutes } from '@shared/enums/routes.enum';

const redirectUnauthorizedToLogin = () =>
	redirectUnauthorizedTo(`/${ERoutes.LOGIN}`);

export const routes: Routes = [
	{ path: '', redirectTo: ERoutes.BOOKS, pathMatch: 'full' },
	{
		path: ERoutes.BOOKS,
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
				path: ERoutes.SEARCH,
				loadComponent: () =>
					import('@pages/home/home-search/home-search.component').then(
						(component) => component.HomeSearchComponent
					),
			},
			{
				path: ERoutes.FAVORITES,
				loadComponent: () =>
					import('@pages/home/home-favorites/home-favorites.component').then(
						(component) => component.HomeFavoriteComponent
					),
			},
			{
				path: ERoutes.UPLOAD,
				loadComponent: () =>
					import('@pages/home/home-upload/home-upload.component').then(
						(component) => component.HomeUploadComponent
					),
			},
			{
				path: ERoutes.PROFILE,
				loadComponent: () =>
					import('@pages/home/profile/profile.component').then(
						(component) => component.ProfileComponent
					),
			},
			{
				path: ERoutes.MYBOOKS,
				loadComponent: () =>
					import('@pages/home/home-my-books/home-my-books.component').then(
						(component) => component.HomeMyBooksComponent
					),
			},
			{
				path: `${ERoutes.MYBOOKS}/:id`,
				loadComponent: () =>
					import('@pages/home/home-my-book/home-my-book.component').then(
						(component) => component.HomeMyBookComponent
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
		path: ERoutes.SIGNUP,
		loadComponent: () =>
			import('@pages/auth/signup/signup.component').then(
				(component) => component.SignupComponent
			),
	},
	{
		path: ERoutes.LOGIN,
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
