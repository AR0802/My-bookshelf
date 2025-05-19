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
import { InteractionService } from '@shared/services/interaction.service';
import { ISignupForm } from '@shared/interfaces';
import {
	namePattern,
	passwordPattern,
} from '@shared/constants/patterns.constants';

@Component({
	selector: 'app-signup',
	imports: [RouterLink, ReactiveFormsModule],
	templateUrl: './signup.component.html',
	styleUrl: './signup.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
	readonly ERoutes = ERoutes;
	fieldPasswordTextType = signal<boolean>(false);
	fieldConfirmPasswordTextType = signal<boolean>(false);
	private router = inject(Router);
	private authService = inject(AuthService);
	private destroyRef = inject(DestroyRef);
	private interactionService = inject(InteractionService);

	authForm = new FormGroup<ISignupForm>({
		name: new FormControl<string>('', [
			Validators.required,
			Validators.pattern(namePattern),
		]),
		email: new FormControl<string>('', [Validators.required, Validators.email]),
		password: new FormControl<string>('', [
			Validators.required,
			Validators.pattern(passwordPattern),
		]),
		confirmPassword: new FormControl<string>('', [
			Validators.required,
			Validators.pattern(passwordPattern),
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
					const errorMessage = this.authService.handleError(error);
					this.interactionService.setError(errorMessage);
					return EMPTY;
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}
}
