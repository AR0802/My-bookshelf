import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IBook } from '@shared/book.interface';
import { SearchBookComponent } from './search-book/search-book.component';

@Component({
	selector: 'app-search-books',
	imports: [SearchBookComponent],
	templateUrl: './search-books.component.html',
	styleUrl: './search-books.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBooksComponent {
	books = input.required<IBook[]>();
}
