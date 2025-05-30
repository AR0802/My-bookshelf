import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	effect,
	Inject,
	inject,
	LOCALE_ID,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';

import { AuthService } from '@shared/services/auth.service';
import { BooksApiService } from '@shared/services/books-api.service';
import { BooksService } from '@shared/services/books.service';
import { IResponse } from '@shared/interfaces';
import { ERoutes } from '@shared/enums/routes.enum';
import { SupabaseStorageService } from '@shared/services/supabase-storage.service';
import { BUCKET_NAME } from '@shared/constants/supabase.constant';
import { InteractionService } from '@shared/services/interaction.service';

@Component({
	selector: 'app-top-panel',
	imports: [RouterLink, FormsModule],
	templateUrl: './top-panel.component.html',
	styleUrl: './top-panel.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopPanelComponent {
	readonly ERoutes = ERoutes;
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
	searchParam = signal<string>($localize`All`);
	imgUrl = signal('');
	userName = signal('');
	private authService = inject(AuthService);
	private booksApiService = inject(BooksApiService);
	private booksService = inject(BooksService);
	private router = inject(Router);
	private destroyRef = inject(DestroyRef);
	private supabaseStorageService = inject(SupabaseStorageService);
	private interactionService = inject(InteractionService);

	constructor(@Inject(LOCALE_ID) private locale: string) {
		effect(() => this.setUserImage());
	}

	private setUserImage(): void {
		if (this.authService.currentUserSig()) {
			this.userName.set(this.authService.currentUserSig()?.name as string);
			if (this.supabaseStorageService.imgUrl()) {
				this.imgUrl.set(this.supabaseStorageService.imgUrl());
			} else {
				this.supabaseStorageService
					.download(
						BUCKET_NAME,
						this.authService.currentUserSig()?.id as string
					)
					.then((data) => {
						if (!data.error) {
							this.imgUrl.set(URL.createObjectURL(data.data!));
							this.supabaseStorageService.imgUrl.set(
								URL.createObjectURL(data.data!)
							);
						}
					});
			}
		}
	}

	logout(): void {
		this.authService
			.logout()
			.pipe(
				tap(() => {
					this.supabaseStorageService.imgUrl.set('');
					this.router.navigateByUrl(`/${ERoutes.LOGIN}`);
				}),
				catchError((error: Error) => {
					this.interactionService.setError(error.message);
					return EMPTY;
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}

	changeSearchParam(param: string): void {
		this.searchParam.set(param);
	}

	private getSearchApiKey(): string {
		let searchApiKey = 'intitle';
		if (this.searchParam() === this.searchParams[2]) {
			searchApiKey = 'inauthor';
		} else if (this.searchParam() === this.searchParams[3]) {
			searchApiKey = 'inpublisher';
		} else if (this.searchParam() === this.searchParams[4]) {
			searchApiKey = 'subject';
		}
		return searchApiKey;
	}

	search(event: Event): void {
		const target = event.target as HTMLInputElement;
		if (!target.validity.valid) return;
		const searchValue = target.value;
		const searchApiKey = this.getSearchApiKey();

		if (this.searchParam() === this.searchParams[0]) {
			this.booksApiService
				.getBooks(searchValue)
				.pipe(
					tap((data: IResponse) => {
						this.booksService.searchBooks.set(true);
						this.booksService.foundBooks.set(data.items);
						if (this.router.url !== `/${ERoutes.BOOKS}/${ERoutes.SEARCH}`) {
							this.router.navigateByUrl(`/${ERoutes.BOOKS}/${ERoutes.SEARCH}`);
						}
					}),
					catchError((error: Error) => {
						this.interactionService.setError(error.message);
						return EMPTY;
					}),
					takeUntilDestroyed(this.destroyRef)
				)
				.subscribe();
		} else {
			this.booksApiService
				.getBooksBySearch(searchApiKey, searchValue)
				.pipe(
					tap((data: IResponse) => {
						this.booksService.searchBooks.set(true);
						this.booksService.foundBooks.set(data.items);
						if (this.router.url !== `/${ERoutes.BOOKS}/${ERoutes.SEARCH}`) {
							this.router.navigateByUrl(`/${ERoutes.BOOKS}/${ERoutes.SEARCH}`);
						}
					}),
					catchError((error: Error) => {
						this.interactionService.setError(error.message);
						return EMPTY;
					}),
					takeUntilDestroyed(this.destroyRef)
				)
				.subscribe();
		}
	}

	changeLanguage(locale: string): void {
		if (this.locale === locale) return;
		location.href = `/${locale}/${this.router.url}`;
	}
}
