import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	OnDestroy,
	OnInit,
	signal,
	WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { SupabaseStorageService } from '@shared/services/supabase-storage.service';
import { AuthService } from '@shared/services/auth.service';
import { IUserBook } from '@shared/interfaces';
import { BUCKET_NAME } from '@shared/constants/supabase.constant';

@Component({
	selector: 'app-user-book',
	imports: [RouterLink],
	templateUrl: './user-book.component.html',
	styleUrl: './user-book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBookComponent implements OnInit, OnDestroy {
	book = input<IUserBook>();
	file = signal('');
	image = signal('');
	private supabaseStorageService = inject(SupabaseStorageService);
	private authService = inject(AuthService);

	ngOnInit(): void {
		this.getFile(this.book()?.file as string, this.file);
		this.getFile(this.book()?.image as string, this.image);
	}

	private getFile(file: string, fileSig: WritableSignal<string>): void {
		this.supabaseStorageService
			.download(BUCKET_NAME, this.authService.currentUserSig()?.id + file)
			.then((data) => {
				if (data.data) {
					fileSig.set(URL.createObjectURL(data.data));
				}
			});
	}

	ngOnDestroy(): void {
		URL.revokeObjectURL(this.image());
	}
}
