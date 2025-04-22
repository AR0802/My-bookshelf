import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IUserBook } from '@shared/interfaces';

@Component({
	selector: 'app-user-book',
	templateUrl: './user-book.component.html',
	styleUrl: './user-book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookComponent {
	book = input<IUserBook>();
}
