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

import { AlertComponent } from '@ui-components/alert/alert.component';
import { AuthService } from '@shared/services/auth.service';
import { SupabaseStorageService } from '@shared/services/supabase-storage.service';
import { BUCKET_NAME } from '@shared/constants/supabase.constant';

@Component({
	selector: 'app-profile',
	imports: [ReactiveFormsModule, AlertComponent],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
	selectedFile = signal<File | null>(null);
	imgUrl = signal('');
	initialName = signal('');
	error = signal('');
	private authService = inject(AuthService);
	private supabaseStorageService = inject(SupabaseStorageService);
	private location = inject(Location);
	private destroyRef = inject(DestroyRef);

	profileForm = new FormGroup({
		name: new FormControl<string>('', [
			Validators.required,
			Validators.pattern('^[a-zA-Zа-яА-ЯёЁ][a-zA-Zа-яА-ЯёЁ0-9_-]{2,15}$'),
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
						this.imgUrl.set(URL.createObjectURL(data.data));
						this.supabaseStorageService.imgUrl.set(this.imgUrl());
					}
				});
		}
	}

	fileSelect(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			this.selectedFile.set(input.files[0]);
		}
		if (this.imgUrl()) {
			URL.revokeObjectURL(this.imgUrl());
		}
		const imageURL = URL.createObjectURL(this.selectedFile()!);
		this.imgUrl.set(imageURL);
	}

	removeImage(): void {
		URL.revokeObjectURL(this.imgUrl());
		this.imgUrl.set('');
		this.selectedFile.set(null);
		this.profileForm.controls.image.setValue('');
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
					this.error.set(error.message);
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
