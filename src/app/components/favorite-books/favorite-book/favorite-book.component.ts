import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
} from '@angular/core';
import { Router } from '@angular/router';
import { SlicePipe } from '@angular/common';

import { IBook } from '@shared/interfaces';
import { ERoutes } from '@shared/enums/routes.enum';
import { SeparatorPipe } from '@shared/pipes/separator.pipe';

@Component({
	selector: 'app-favorite-book',
	imports: [SlicePipe, SeparatorPipe],
	templateUrl: './favorite-book.component.html',
	styleUrl: './favorite-book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteBookComponent {
	book = input<IBook>();
	private router = inject(Router);

	protected navigate(): void {
		this.router.navigateByUrl(`/${ERoutes.BOOKS}/${this.book()?.id}`);
	}
}
