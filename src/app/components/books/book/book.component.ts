import {
	ChangeDetectionStrategy,
	Component,
	input,
	OnInit,
	signal,
} from '@angular/core';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { IBook } from '@shared/interfaces';

@Component({
	selector: 'app-book',
	imports: [RouterLink, SlicePipe],
	templateUrl: './book.component.html',
	styleUrl: './book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent implements OnInit {
	book = input<IBook>();
	separator = signal<string>('');

	ngOnInit(): void {
		if (
			this.book()?.volumeInfo?.authors &&
			this.book()?.volumeInfo?.publishedDate
		) {
			this.separator.set(', ');
		}
	}
}
