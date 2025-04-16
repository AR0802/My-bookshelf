import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
} from '@angular/core';
import { Router } from '@angular/router';

import { IBook } from '@shared/book.interface';
import { ERoutes } from '@shared/routes.enum';

@Component({
	selector: 'app-favorite-book',
	templateUrl: './favorite-book.component.html',
	styleUrl: './favorite-book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteBookComponent {
	private router = inject(Router);
	book = input<IBook>();

	navigate(): void {
		this.router.navigateByUrl(`${ERoutes.books}/${this.book()?.id}`);
	}
}
