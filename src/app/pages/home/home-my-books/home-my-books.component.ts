import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
	signal,
} from '@angular/core';

import { UserBooksComponent } from '@components/user-books/user-books.component';
import { BooksService } from '@shared/services/books.service';
import { AuthService } from '@shared/services/auth.service';
import { IUserBook } from '@shared/interfaces';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
	selector: 'app-home-my-books',
	imports: [UserBooksComponent],
	templateUrl: './home-my-books.component.html',
	styleUrl: './home-my-books.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeMyBooksComponent implements OnInit {
	books = signal<IUserBook[]>([]);
	private booksService = inject(BooksService);
	private authService = inject(AuthService);

	ngOnInit(): void {
		this.booksService
			.getUserBooks()
			.pipe(
				tap((userBooks: IUserBook[]) => {
					const booksOfUser: IUserBook[] = userBooks.filter(
						(userBook: IUserBook) =>
							userBook.userId === this.authService.currentUserSig()?.id
					);
					this.books.set(booksOfUser);
				}),
				catchError(() => {
					return EMPTY;
				})
			)
			.subscribe();
	}
}
