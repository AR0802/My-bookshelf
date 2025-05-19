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
import { InteractionService } from '@shared/services/interaction.service';
import { ILoginForm } from '@shared/interfaces';
import { passwordPattern } from '@shared/constants/patterns.constants';

@Component({
	selector: 'app-login',
	imports: [RouterLink, ReactiveFormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
	readonly ERoutes = ERoutes;
	fieldTextType = signal<boolean>(false);
	private router = inject(Router);
	private authService = inject(AuthService);
	private destroyRef = inject(DestroyRef);
	private interactionService = inject(InteractionService);

	authForm = new FormGroup<ILoginForm>({
		email: new FormControl<string>('', [Validators.required, Validators.email]),
		password: new FormControl<string>('', [
			Validators.required,
			Validators.pattern(passwordPattern),
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
					const errorMessage = this.authService.handleError(error);
					this.interactionService.setError(errorMessage);
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
					this.interactionService.setError(error.message);
					return EMPTY;
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}
}
