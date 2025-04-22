import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal,
	WritableSignal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

import { AuthService } from '@shared/services/auth.service';
import { ERoutes } from '@shared/enums/routes.enum';
import { catchError, EMPTY } from 'rxjs';

@Component({
	selector: 'app-signup',
	imports: [RouterLink, NgClass, FormsModule],
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

	toggleFieldTextType(field: WritableSignal<boolean>): void {
		field.update((fieldTextType) => !fieldTextType);
	}

	signup(form: NgForm) {
		const { name, email, password } = form.value;
		this.authService
			.signup(name, email, password)
			.pipe(
				catchError(() => {
					return EMPTY;
				})
			)
			.subscribe(() => {
				this.router.navigateByUrl(`${ERoutes.BOOKS}`);
			});
	}
}
