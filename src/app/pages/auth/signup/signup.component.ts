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
	EMAIL_IN_USER_ERROR,
	TOO_MANY_REQUEST_ERROR,
} from '@shared/constants/firebase-errors.constants';

@Component({
	selector: 'app-signup',
	imports: [RouterLink, ReactiveFormsModule, AlertComponent],
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

	authForm = new FormGroup({
		name: new FormControl<string>('', [
			Validators.required,
			Validators.pattern('[a-zA-Zа-яА-ЯёЁ][a-zA-Zа-яА-ЯёЁ0-9_-]{2,15}'),
		]),
		email: new FormControl<string>('', [Validators.required, Validators.email]),
		password: new FormControl<string>('', [
			Validators.required,
			Validators.pattern(
				'(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}'
			),
		]),
		confirmPassword: new FormControl<string>('', [
			Validators.required,
			Validators.pattern(
				'(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}'
			),
		]),
	});

	toggleFieldTextType(field: WritableSignal<boolean>): void {
		field.update((fieldTextType) => !fieldTextType);
	}

	signup(): void {
		const { name, email, password } = this.authForm.value;
		this.authService
			.signup(name!, email!, password!)
			.pipe(
				tap(() => {
					this.router.navigateByUrl(`${ERoutes.BOOKS}`);
				}),
				catchError((error: Error) => {
					if (error.message === EMAIL_IN_USER_ERROR) {
						this.error.set('Such email already exists!');
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
}
