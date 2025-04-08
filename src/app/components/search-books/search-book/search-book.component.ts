import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
} from '@angular/core';
import { Router } from '@angular/router';

import { IBook } from '@shared/book.interface';

@Component({
	selector: 'app-search-book',
	templateUrl: './search-book.component.html',
	styleUrl: './search-book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBookComponent {
	private router = inject(Router);
	book = input<IBook>();

	previewBook(): void {
		this.router.navigateByUrl(`/books/${this.book()?.id}`);
	}
}
