import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { catchError, EMPTY, tap } from 'rxjs';

import { BooksService } from '@shared/services/books.service';
import { AuthService } from '@shared/services/auth.service';
import { IUserBook } from '@shared/interfaces';
import { Router } from '@angular/router';
import { ERoutes } from '@shared/enums/routes.enum';
import { AlertComponent } from '@ui-components/alert/alert.component';

@Component({
	selector: 'app-home-upload',
	imports: [ReactiveFormsModule, AlertComponent],
	templateUrl: './home-upload.component.html',
	styleUrl: './home-upload.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeUploadComponent {
	error = signal<string>('');
	private booksService = inject(BooksService);
	private authService = inject(AuthService);
	private router = inject(Router);
	private destroyRef = inject(DestroyRef);

	uploadBookForm = new FormGroup({
		title: new FormControl<string>('', [Validators.required]),
		author: new FormControl<string>('', [Validators.required]),
		description: new FormControl<string>('', [Validators.required]),
		file: new FormControl<string>('', [Validators.required]),
		image: new FormControl<string>('', [Validators.required]),
	});

	upload(): void {
		const userId = this.authService.currentUserSig()?.id;
		const userBook = { ...this.uploadBookForm.value, userId };
		this.booksService
			.addUserBook(userBook as Omit<IUserBook, 'id'>)
			.pipe(
				tap(() => {
					this.router.navigateByUrl(`/${ERoutes.BOOKS}/${ERoutes.MYBOOKS}`);
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
