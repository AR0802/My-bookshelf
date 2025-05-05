import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	OnInit,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, tap } from 'rxjs';

import { UserBooksComponent } from '@components/user-books/user-books.component';
import { BooksService } from '@shared/services/books.service';
import { AuthService } from '@shared/services/auth.service';
import { IUserBook } from '@shared/interfaces';
import { AlertComponent } from '@ui-components/alert/alert.component';

@Component({
	selector: 'app-home-my-books',
	imports: [UserBooksComponent, AlertComponent],
	templateUrl: './home-my-books.component.html',
	styleUrl: './home-my-books.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeMyBooksComponent implements OnInit {
	books = signal<IUserBook[]>([]);
	error = signal<string>('');
	private booksService = inject(BooksService);
	private authService = inject(AuthService);
	private destroyRef = inject(DestroyRef);

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
				catchError((error: Error) => {
					this.error.set(error.message);
					return EMPTY;
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}
}
