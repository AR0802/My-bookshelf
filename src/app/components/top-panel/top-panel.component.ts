import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	inject,
	LOCALE_ID,
	output,
	signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@shared/services/auth.service';
import { BooksService } from '@shared/services/books.service';
import { IResponse } from '@shared/interfaces';
import { ERoutes } from '@shared/enums/routes.enum';
import { catchError, EMPTY } from 'rxjs';

@Component({
	selector: 'app-top-panel',
	imports: [RouterLink, FormsModule],
	templateUrl: './top-panel.component.html',
	styleUrl: './top-panel.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopPanelComponent {
	readonly routes = ERoutes;
	searchParams: string[] = [
		$localize`All`,
		$localize`Title`,
		$localize`Author`,
		$localize`Publisher`,
		$localize`Subjects`,
	];
	localesList = [
		{ code: 'en-US', label: $localize`English` },
		{ code: 'es-PR', label: $localize`Spanish` },
	];
	foundBooks = output<IResponse>();
	searchParam = signal<string>($localize`All`);
	private authService = inject(AuthService);
	private booksService = inject(BooksService);
	private router = inject(Router);

	constructor(@Inject(LOCALE_ID) private locale: string) {}

	logout(): void {
		this.authService
			.logout()
			.pipe(
				catchError(() => {
					return EMPTY;
				})
			)
			.subscribe(() => {
				this.router.navigateByUrl(`/${ERoutes.Login}`);
			});
	}

	changeSearchParam(param: string): void {
		this.searchParam.set(param);
	}

	search(event: Event): void {
		const target = event.target as HTMLInputElement;
		if (!target.validity.valid) return;
		const searchValue = target.value;

		let searchApiKey = 'intitle';
		if (this.searchParam() === this.searchParams[2]) {
			searchApiKey = 'inauthor';
		} else if (this.searchParam() === this.searchParams[3]) {
			searchApiKey = 'inpublisher';
		} else if (this.searchParam() === this.searchParams[4]) {
			searchApiKey = 'subject';
		}

		if (this.searchParam() === this.searchParams[0]) {
			this.booksService
				.getBooks(searchValue)
				.pipe(
					catchError(() => {
						return [];
					})
				)
				.subscribe((data: IResponse) => {
					this.booksService.searchBooks.set(true);
					this.foundBooks.emit(data);
					if (this.router.url !== `/${ERoutes.Books}/${ERoutes.Search}`) {
						this.router.navigateByUrl(`/${ERoutes.Books}/${ERoutes.Search}`);
					}
				});
		} else {
			this.booksService
				.getBooksBySearch(searchApiKey, searchValue)
				.pipe(
					catchError(() => {
						return [];
					})
				)
				.subscribe((data: IResponse) => {
					this.booksService.searchBooks.set(true);
					this.foundBooks.emit(data);
					if (this.router.url !== `/${ERoutes.Books}/${ERoutes.Search}`) {
						this.router.navigateByUrl(`/${ERoutes.Books}/${ERoutes.Search}`);
					}
				});
		}
	}

	changeLanguage(locale: string): void {
		if (this.locale === locale) return;
		location.href = `/${locale}/${this.router.url}`;
	}
}
