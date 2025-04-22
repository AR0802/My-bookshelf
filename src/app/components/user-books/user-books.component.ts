import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { UserBookComponent } from './user-book/user-book.component';
import { IUserBook } from '@shared/interfaces';

@Component({
	selector: 'app-user-books',
	imports: [UserBookComponent],
	templateUrl: './user-books.component.html',
	styleUrl: './user-books.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBooksComponent {
	books = input.required<IUserBook[]>();
}
