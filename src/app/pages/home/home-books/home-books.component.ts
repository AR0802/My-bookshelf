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
		$localize`Programming`,
		$localize`Science`,
		$localize`Self-development`,
		$localize`Sport`,
	];
}
