import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';

import { BooksService } from '@shared/services/books.service';
import { AuthService } from '@shared/services/auth.service';
import { IUserBook } from '@shared/interfaces';
import { Router } from '@angular/router';
import { ERoutes } from '@shared/enums/routes.enum';
import { catchError, EMPTY } from 'rxjs';

@Component({
	selector: 'app-home-upload',
	imports: [ReactiveFormsModule, NgClass],
	templateUrl: './home-upload.component.html',
	styleUrl: './home-upload.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeUploadComponent {
	private booksService = inject(BooksService);
	private authService = inject(AuthService);
	private formBuilder = inject(FormBuilder);
	private router = inject(Router);

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
				catchError(() => {
					return EMPTY;
				})
			)
			.subscribe(() => {
				this.router.navigateByUrl(`/${ERoutes.BOOKS}/${ERoutes.MYBOOKS}`);
			});
	}
}
