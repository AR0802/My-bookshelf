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
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';

import { BooksApiService } from '@shared/services/books-api.service';
import { AuthService } from '@shared/services/auth.service';
import { InteractionService } from '@shared/services/interaction.service';
import { SupabaseStorageService } from '@shared/services/supabase-storage.service';
import { IUserBook, IBookUploadForm } from '@shared/interfaces';
import { ERoutes } from '@shared/enums/routes.enum';
import { BUCKET_NAME } from '@shared/constants/supabase.constant';

@Component({
	selector: 'app-home-upload',
	imports: [ReactiveFormsModule],
	templateUrl: './home-upload.component.html',
	styleUrl: './home-upload.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeUploadComponent {
	selectedFile = signal<File | null>(null);
	selectedImage = signal<File | null>(null);
	private booksApiService = inject(BooksApiService);
	private authService = inject(AuthService);
	private interactionService = inject(InteractionService);
	private supabaseStorageService = inject(SupabaseStorageService);
	private router = inject(Router);
	private destroyRef = inject(DestroyRef);

	uploadBookForm = new FormGroup<IBookUploadForm>({
		title: new FormControl<string>('', [Validators.required]),
		author: new FormControl<string>('', [Validators.required]),
		description: new FormControl<string>('', [Validators.required]),
		file: new FormControl<string>('', [Validators.required]),
		image: new FormControl<string>('', [Validators.required]),
	});

	private uploadFile(inputValue: string, selectedFile: File): void {
		this.supabaseStorageService
			.upload(
				BUCKET_NAME,
				this.authService.currentUserSig()?.id + inputValue,
				selectedFile
			)
			.then((data) => {
				if (data.error) {
					this.interactionService.setError(data.error.message);
				}
			});
	}

	upload(): void {
		const userBook = {
			...this.uploadBookForm.value,
			userId: this.authService.currentUserSig()?.id,
		};
		this.uploadFile(this.uploadBookForm.value.file!, this.selectedFile()!);
		this.uploadFile(this.uploadBookForm.value.image!, this.selectedImage()!);
		this.booksApiService
			.addUserBook(userBook as Omit<IUserBook, 'id'>)
			.pipe(
				tap(() => {
					this.router.navigateByUrl(`/${ERoutes.BOOKS}/${ERoutes.MYBOOKS}`);
				}),
				catchError((error: Error) => {
					this.interactionService.setError(error.message);
					return EMPTY;
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}

	fileSelect(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			if (input.accept === '.pdf') {
				this.selectedFile.set(file);
			} else {
				this.selectedImage.set(file);
			}
		}
	}
}
