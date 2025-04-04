import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IBook } from '../../../shared/book.interface';

@Component({
	selector: 'app-book',
	templateUrl: './book.component.html',
	styleUrl: './book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
	book = input<IBook>();
}
