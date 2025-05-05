import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	OnInit,
	signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { SlicePipe } from '@angular/common';

import { IBook } from '@shared/interfaces';
import { ERoutes } from '@shared/enums/routes.enum';

@Component({
	selector: 'app-favorite-book',
	imports: [SlicePipe],
	templateUrl: './favorite-book.component.html',
	styleUrl: './favorite-book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteBookComponent implements OnInit {
	book = input<IBook>();
	separator = signal<string>('');
	private router = inject(Router);

	ngOnInit(): void {
		if (
			this.book()?.volumeInfo?.authors &&
			this.book()?.volumeInfo?.publishedDate
		) {
			this.separator.set(', ');
		}
	}

	navigate(): void {
		this.router.navigateByUrl(`/${ERoutes.BOOKS}/${this.book()?.id}`);
	}
}
