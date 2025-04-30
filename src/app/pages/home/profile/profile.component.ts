import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
	signal,
} from '@angular/core';

import { AuthService } from '@shared/services/auth.service';
import { SupabaseStorageService } from '@shared/services/supabase-storage.service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
	selectedFile = signal<File | null>(null);
	bucket = signal('');
	imgUrl = signal('');
	private authService = inject(AuthService);
	private supabaseStorageService = inject(SupabaseStorageService);

	ngOnInit(): void {
		this.checkBucketExists();
	}

	checkBucketExists(): void {
		this.supabaseStorageService.getBucket().then((data) => {
			this.bucket.set(data.data?.name as string);

			this.supabaseStorageService
				.download(
					this.bucket(),
					this.authService.currentUserSig()?.id as string
				)
				.then((data) => {
					if (data.error) {
						console.log(data.error);
					} else {
						this.imgUrl.set(URL.createObjectURL(data.data!));
					}
				});
		});
	}

	fileSelect(event: Event): void {
		const input = event.target as HTMLInputElement;

		if (input.files && input.files.length > 0) {
			this.selectedFile.set(input.files[0]);
		}
	}

	upload(): void {
		if (!this.selectedFile) return;

		this.supabaseStorageService
			.upload(
				this.bucket(),
				this.authService.currentUserSig()?.id as string,
				this.selectedFile()!
			)
			.then((data) => {
				if (data.error) {
					console.log(data.error);
				} else {
					console.log(data.data);
				}
			});
	}
}
