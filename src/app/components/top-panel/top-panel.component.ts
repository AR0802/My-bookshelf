import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	effect,
	Inject,
	inject,
	LOCALE_ID,
	output,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';

import { AuthService } from '@shared/services/auth.service';
import { BooksService } from '@shared/services/books.service';
import { IResponse } from '@shared/interfaces';
import { ERoutes } from '@shared/enums/routes.enum';
import { AlertComponent } from '@ui-components/alert/alert.component';
import { SupabaseStorageService } from '@shared/services/supabase-storage.service';
import { BUCKET_NAME } from '@shared/constants/supabase.constant';

@Component({
	selector: 'app-top-panel',
	imports: [RouterLink, FormsModule, AlertComponent],
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
	foundBooks = output<IResponse>();
	searchParam = signal<string>($localize`All`);
	error = signal<string>('');
	imgUrl = signal('');
	userName = signal('');
	private authService = inject(AuthService);
	private booksService = inject(BooksService);
	private router = inject(Router);
	private destroyRef = inject(DestroyRef);
	private supabaseStorageService = inject(SupabaseStorageService);

	private setUserImageEffect = effect(() => {
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
	});

	constructor(@Inject(LOCALE_ID) private locale: string) {}

	logout(): void {
		this.authService
			.logout()
			.pipe(
				tap(() => {
					this.supabaseStorageService.imgUrl.set('');
					this.router.navigateByUrl(`/${ERoutes.LOGIN}`);
				}),
				catchError((error: Error) => {
					this.error.set(error.message);
					return EMPTY;
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}

	protected changeSearchParam(param: string): void {
		this.searchParam.set(param);
	}

	protected search(event: Event): void {
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
					tap((data: IResponse) => {
						this.booksService.searchBooks.set(true);
						this.foundBooks.emit(data);
						if (this.router.url !== `/${ERoutes.BOOKS}/${ERoutes.SEARCH}`) {
							this.router.navigateByUrl(`/${ERoutes.BOOKS}/${ERoutes.SEARCH}`);
						}
					}),
					catchError((error: Error) => {
						this.error.set(error.message);
						return EMPTY;
					}),
					takeUntilDestroyed(this.destroyRef)
				)
				.subscribe();
		} else {
			this.booksService
				.getBooksBySearch(searchApiKey, searchValue)
				.pipe(
					tap((data: IResponse) => {
						this.booksService.searchBooks.set(true);
						this.foundBooks.emit(data);
						if (this.router.url !== `/${ERoutes.BOOKS}/${ERoutes.SEARCH}`) {
							this.router.navigateByUrl(`/${ERoutes.BOOKS}/${ERoutes.SEARCH}`);
						}
					}),
					catchError((error: Error) => {
						this.error.set(error.message);
						return EMPTY;
					}),
					takeUntilDestroyed(this.destroyRef)
				)
				.subscribe();
		}
	}

	protected changeLanguage(locale: string): void {
		if (this.locale === locale) return;
		location.href = `/${locale}/${this.router.url}`;
	}
}
