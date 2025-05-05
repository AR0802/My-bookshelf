import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { catchError, EMPTY, tap } from 'rxjs';

import { AuthService } from '@shared/services/auth.service';
import { ERoutes } from '@shared/enums/routes.enum';
import { AlertComponent } from '@ui-components/alert/alert.component';
import {
	INVALID_CREDENTIAL_ERROR,
	TOO_MANY_REQUEST_ERROR,
} from '@shared/constants/firebase-errors.constants';

@Component({
	selector: 'app-login',
	imports: [RouterLink, ReactiveFormsModule, AlertComponent],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
	readonly ERoutes = ERoutes;
	fieldTextType = signal<boolean>(false);
	error = signal<string>('');
	private router = inject(Router);
	private authService = inject(AuthService);
	private destroyRef = inject(DestroyRef);

	authForm = new FormGroup({
		email: new FormControl<string>('', [Validators.required, Validators.email]),
		password: new FormControl<string>('', [
			Validators.required,
			Validators.pattern(
				'(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}'
			),
		]),
	});

	toggleFieldTextType(): void {
		this.fieldTextType.update((fieldTextType) => !fieldTextType);
	}

	login(): void {
		const { email, password } = this.authForm.value;
		this.authService
			.login(email!, password!)
			.pipe(
				tap(() => {
					this.router.navigateByUrl(`${ERoutes.BOOKS}`);
				}),
				catchError((error: Error) => {
					if (error.message === INVALID_CREDENTIAL_ERROR) {
						this.error.set('Invalid login or password!');
					} else if (error.message === TOO_MANY_REQUEST_ERROR) {
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

	loginWithGoogle() {
		this.authService
			.loginWithGoogle()
			.pipe(
				tap(() => {
					this.router.navigateByUrl(`${ERoutes.BOOKS}`);
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
