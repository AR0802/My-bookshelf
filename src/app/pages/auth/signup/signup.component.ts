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
	selector: 'app-signup',
	imports: [RouterLink, NgClass, FormsModule],
	templateUrl: './signup.component.html',
	styleUrl: './signup.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignupComponent {
	private router = inject(Router);
	private authService = inject(AuthService);
	fieldPasswordTextType = signal<boolean>(false);
	fieldConfirmPasswordTextType = signal<boolean>(false);

	toggleFieldTextType(field: WritableSignal<boolean>): void {
		field.update((fieldTextType) => !fieldTextType);
	}

	signup(form: NgForm) {
		const { name, email, password } = form.value;
		this.authService.signup(name, email, password).subscribe(() => {
			this.router.navigateByUrl('/books');
		});
	}
}
