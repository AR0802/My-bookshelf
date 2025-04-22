import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

import { AuthService } from '@shared/services/auth.service';
import { ERoutes } from '@shared/enums/routes.enum';
import { catchError, EMPTY } from 'rxjs';

@Component({
	selector: 'app-login',
	imports: [RouterLink, NgClass, FormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
	readonly ERoutes = ERoutes;
	fieldTextType = signal<boolean>(false);
	private router = inject(Router);
	private authService = inject(AuthService);

	toggleFieldTextType(): void {
		this.fieldTextType.update((fieldTextType) => !fieldTextType);
	}

	login(form: NgForm) {
		const { email, password } = form.value;
		this.authService
			.login(email, password)
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
