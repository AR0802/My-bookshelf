import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	signal,
	WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { catchError, EMPTY, tap } from 'rxjs';

import { AuthService } from '@shared/services/auth.service';
import { ERoutes } from '@shared/enums/routes.enum';
import { AlertComponent } from '@components/alert/alert.component';
import {
	emailInUseError,
	tooManyRequestsError,
} from '@shared/constants/firebase-errors.constants';

@Component({
	selector: 'app-signup',
	imports: [RouterLink, NgClass, FormsModule, AlertComponent],
	templateUrl: './signup.component.html',
	styleUrl: './signup.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
	readonly ERoutes = ERoutes;
	fieldPasswordTextType = signal<boolean>(false);
	fieldConfirmPasswordTextType = signal<boolean>(false);
	error = signal<string>('');
	private router = inject(Router);
	private authService = inject(AuthService);
	private destroyRef = inject(DestroyRef);

	toggleFieldTextType(field: WritableSignal<boolean>): void {
		field.update((fieldTextType) => !fieldTextType);
	}

	signup(form: NgForm): void {
		const { name, email, password } = form.value;
		this.authService
			.signup(name, email, password)
			.pipe(
				tap(() => {
					this.router.navigateByUrl(`${ERoutes.BOOKS}`);
				}),
				catchError((error: Error) => {
					if (error.message === emailInUseError) {
						this.error.set('Such email already exists!');
					} else if (error.message === tooManyRequestsError) {
						this.error.set('Too many requests, try later!');
					} else {
						this.error.set(error.message);
					}
					return EMPTY;
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}
}
