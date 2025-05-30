import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	OnInit,
	signal,
} from '@angular/core';
import { SlicePipe } from '@angular/common';
import { Router } from '@angular/router';

import { IBook } from '@shared/interfaces';
import { ERoutes } from '@shared/enums/routes.enum';
import { SeparatorPipe } from '@shared/pipes/separator.pipe';

@Component({
	selector: 'app-search-book',
	imports: [SlicePipe, SeparatorPipe],
	templateUrl: './search-book.component.html',
	styleUrl: './search-book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBookComponent implements OnInit {
	book = input<IBook>();
	isFavorite = signal<boolean>(false);
	private router = inject(Router);

	ngOnInit(): void {
		if (localStorage.getItem(this.book()?.id as string)) {
			this.isFavorite.set(true);
		}
	}

	previewBook(): void {
		this.router.navigateByUrl(`${ERoutes.BOOKS}/${this.book()?.id}`);
	}

	toggleFavorite(): void {
		if (!this.isFavorite()) {
			localStorage.setItem(
				this.book()?.id as string,
				JSON.stringify(this.book())
			);
		} else {
			localStorage.removeItem(this.book()?.id as string);
		}
		this.isFavorite.set(!this.isFavorite());
	}
}
