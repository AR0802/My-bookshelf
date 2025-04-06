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

import { AuthService } from '../../../shared/auth.service';

@Component({
	selector: 'app-login',
	imports: [RouterLink, NgClass, FormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
	private router = inject(Router);
	private authService = inject(AuthService);
	fieldTextType: WritableSignal<boolean> = signal(false);

	toggleFieldTextType(): void {
		this.fieldTextType.update((fieldTextType) => !fieldTextType);
	}

	login(form: NgForm) {
		const { email, password } = form.value;
		this.authService.login(email, password).subscribe(() => {
			this.router.navigateByUrl('/books');
		});
	}
}
