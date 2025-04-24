import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { catchError, EMPTY, tap } from 'rxjs';

import { BooksService } from '@shared/services/books.service';
import { AuthService } from '@shared/services/auth.service';
import { IUserBook } from '@shared/interfaces';
import { Router } from '@angular/router';
import { ERoutes } from '@shared/enums/routes.enum';
import { AlertComponent } from '@components/alert/alert.component';

@Component({
	selector: 'app-home-upload',
	imports: [ReactiveFormsModule, NgClass, AlertComponent],
	templateUrl: './home-upload.component.html',
	styleUrl: './home-upload.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeUploadComponent {
	error = signal<string>('');
	private booksService = inject(BooksService);
	private authService = inject(AuthService);
	private formBuilder = inject(FormBuilder);
	private router = inject(Router);
	private destroyRef = inject(DestroyRef);

	uploadBookForm = this.formBuilder.nonNullable.group({
		title: ['', [Validators.required]],
		author: ['', [Validators.required]],
		description: ['', [Validators.required]],
		file: ['', [Validators.required]],
		image: ['', [Validators.required]],
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
