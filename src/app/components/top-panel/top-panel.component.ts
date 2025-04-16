import {
	ChangeDetectionStrategy,
	Component,
	inject,
	output,
	signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@shared/auth.service';
import { BooksService } from '@shared/books.service';
import { IResponse } from '@shared/response.interface';
import { ERoutes } from '@shared/routes.enum';

@Component({
	selector: 'app-top-panel',
	imports: [RouterLink],
	templateUrl: './top-panel.component.html',
	styleUrl: './top-panel.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopPanelComponent {
	private authService = inject(AuthService);
	private booksService = inject(BooksService);
	private router = inject(Router);
	searchParam = signal<string>($localize`All`);
	foundBooks = output<IResponse>();
	searchParams: string[] = [$localize`All`, $localize`Title`, $localize`Author`, $localize`Publisher`, $localize`Subjects`];
	readonly routes = ERoutes;
	localesList = [
		{code: "en-US", label: "English"},
		{code: "es-PR", label: "Spanish"}
	];

	logout(): void {
		this.authService.logout().subscribe(() => {
			this.router.navigateByUrl(ERoutes.login);
		});
	}

	changeSearchParam(param: string): void {
		this.searchParam.set(param);
	}

	search(event: Event): void {
		const searchValue = (event.target as HTMLInputElement).value;
		if (searchValue.trim() === '') {
			return;
		}

		let searchApiKey = 'intitle';
		if (this.searchParam() === this.searchParams[2]) {
			searchApiKey = 'inauthor';
		} else if (this.searchParam() === this.searchParams[3]) {
			searchApiKey = 'inpublisher';
		} else if (this.searchParam() === this.searchParams[4]) {
			searchApiKey = 'subject';
		}

		if (this.searchParam() === this.searchParams[0]) {
			this.booksService.getBooks(searchValue).subscribe((data: IResponse) => {
				this.foundBooks.emit(data);
				if (this.router.url !== ERoutes.search) {
					this.router.navigateByUrl(ERoutes.search);
				}
			});
		} else {
			this.booksService
				.getBooksBySearch(searchApiKey, searchValue)
				.subscribe((data: IResponse) => {
					this.foundBooks.emit(data);
					if (this.router.url !== ERoutes.search) {
						this.router.navigateByUrl(ERoutes.search);
					}
				});
		}
	}
}
