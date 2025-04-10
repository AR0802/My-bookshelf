import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	OnInit,
	signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

import { IBook } from '@shared/book.interface';

@Component({
	selector: 'app-search-book',
	imports: [NgClass],
	templateUrl: './search-book.component.html',
	styleUrl: './search-book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBookComponent implements OnInit {
	private router = inject(Router);
	book = input<IBook>();
	isFavorite = signal<boolean>(false);

	ngOnInit(): void {
		if (localStorage.getItem(this.book()?.id as string)) {
			this.isFavorite.set(true);
		}
	}

	previewBook(): void {
		this.router.navigateByUrl(`/books/${this.book()?.id}`);
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
