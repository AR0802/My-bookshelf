import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BooksComponent } from '@components/books/books.component';

@Component({
	selector: 'app-home-books',
	imports: [BooksComponent],
	templateUrl: './home-books.component.html',
	styleUrl: './home-books.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeBooksComponent {
	categories: string[] = [
		'Programming',
		'Science',
		'Self-development',
		'Sport',
	];
}
