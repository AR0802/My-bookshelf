import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	OnInit,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Location } from '@angular/common';
import { catchError, EMPTY, tap } from 'rxjs';

import { AuthService } from '@shared/services/auth.service';
import { SupabaseStorageService } from '@shared/services/supabase-storage.service';
import { BUCKET_NAME } from '@shared/constants/supabase.constant';
import { InteractionService } from '@shared/services/interaction.service';
import { IProfileForm } from '@shared/interfaces';
import { namePattern } from '@shared/constants/patterns.constants';

@Component({
	selector: 'app-profile',
	imports: [ReactiveFormsModule],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
	selectedFile = signal<File | null>(null);
	imgUrl = signal('');
	initialName = signal('');
	imgChange = signal(false);
	private authService = inject(AuthService);
	private supabaseStorageService = inject(SupabaseStorageService);
	private location = inject(Location);
	private destroyRef = inject(DestroyRef);
	private interactionService = inject(InteractionService);

	profileForm = new FormGroup<IProfileForm>({
		name: new FormControl<string>('', [
			Validators.required,
			Validators.pattern(namePattern),
		]),
		image: new FormControl<string>(''),
	});

	ngOnInit(): void {
		this.profileForm.controls.name.setValue(
			this.authService.currentUserSig()?.name as string
		);
		this.initialName.set(this.authService.currentUserSig()?.name as string);
		if (this.supabaseStorageService.imgUrl()) {
			this.imgUrl.set(this.supabaseStorageService.imgUrl());
		} else {
			this.supabaseStorageService
				.download(BUCKET_NAME, this.authService.currentUserSig()?.id as string)
				.then((data) => {
					if (data.data) {
						this.createURL(data.data);
						this.supabaseStorageService.imgUrl.set(this.imgUrl());
					}
				});
		}
	}

	private createURL(file: File | Blob): void {
		if (this.imgUrl()) {
			URL.revokeObjectURL(this.imgUrl());
		}
		this.imgUrl.set(URL.createObjectURL(file));
	}

	private revokeURL(): void {
		if (this.imgUrl()) {
			URL.revokeObjectURL(this.imgUrl());
			this.imgUrl.set('');
		}
	}

	fileSelect(event: Event): void {
		const input = event.target as HTMLInputElement;
		this.revokeURL();
		if (input.files && input.files.length > 0) {
			this.selectedFile.set(input.files[0]);
		} else return;
		this.imgChange.set(true);
		this.createURL(this.selectedFile()!);
	}

	removeImage(): void {
		this.imgUrl.set('');
		this.selectedFile.set(null);
		this.profileForm.controls.image.setValue('');
		this.imgChange.set(false);
	}

	saveProfile(): void {
		const name = this.profileForm.value.name!;
		this.authService
			.updateName(name)
			.pipe(
				tap(() => {
					this.authService.currentUserSig.update((user) => ({
						...user,
						name,
					}));
					this.initialName.set(name);
					this.location.back();
				}),
				catchError((error: Error) => {
					this.interactionService.setError(error.message);
					return EMPTY;
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
		if (this.selectedFile()) {
			this.supabaseStorageService
				.upload(
					BUCKET_NAME,
					this.authService.currentUserSig()?.id as string,
					this.selectedFile()!
				)
				.then((data) => {
					if (!data.error) {
						this.supabaseStorageService.imgUrl.set(this.imgUrl());
					}
				});
		}
	}
}
