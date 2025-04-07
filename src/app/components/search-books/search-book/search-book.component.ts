import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IBook } from '../../../shared/book.interface';

@Component({
	selector: 'app-search-book',
	templateUrl: './search-book.component.html',
	styleUrl: './search-book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBookComponent {
	book = input<IBook>();
}
