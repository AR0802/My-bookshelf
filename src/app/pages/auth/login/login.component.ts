import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	signal,
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
	invalidCredentialError,
	tooManyRequestsError,
} from '@shared/constants/firebase-errors.constants';

@Component({
	selector: 'app-login',
	imports: [RouterLink, NgClass, FormsModule, AlertComponent],
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

	toggleFieldTextType(): void {
		this.fieldTextType.update((fieldTextType) => !fieldTextType);
	}

	login(form: NgForm) {
		const { email, password } = form.value;
		this.authService
			.login(email, password)
			.pipe(
				tap(() => {
					this.router.navigateByUrl(`${ERoutes.BOOKS}`);
				}),
				catchError((error: Error) => {
					if (error.message === invalidCredentialError) {
						this.error.set('Invalid login or password!');
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
