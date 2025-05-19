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

import { BooksContainerComponent } from '@components/books-container/books-container.component';
import { BooksApiService } from '@shared/services/books-api.service';
import { AuthService } from '@shared/services/auth.service';
import { IUserBook } from '@shared/interfaces';
import { InteractionService } from '@shared/services/interaction.service';

@Component({
	selector: 'app-home-my-books',
	imports: [BooksContainerComponent],
	templateUrl: './home-my-books.component.html',
	styleUrl: './home-my-books.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeMyBooksComponent implements OnInit {
	books = signal<IUserBook[]>([]);
	private booksApiService = inject(BooksApiService);
	private authService = inject(AuthService);
	private destroyRef = inject(DestroyRef);
	private interactionService = inject(InteractionService);

	ngOnInit(): void {
		this.setUserBooks();
	}

	private setUserBooks(): void {
		this.booksApiService
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
					this.interactionService.setError(error.message);
					return EMPTY;
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}
}
