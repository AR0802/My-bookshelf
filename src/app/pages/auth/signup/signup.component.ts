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

@Component({
	selector: 'app-signup',
	imports: [RouterLink, NgClass, FormsModule],
	templateUrl: './signup.component.html',
	styleUrl: './signup.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignupComponent {
	private router = inject(Router);
	fieldPasswordTextType = signal<boolean>(false);
	fieldConfirmPasswordTextType = signal<boolean>(false);

	toggleFieldTextType(field: WritableSignal<boolean>): void {
		field.update((fieldTextType) => !fieldTextType);
	}

	submit(form: NgForm) {
		const { name, email, password, confirmPassword } = form.value;

		console.log(name, email, password, confirmPassword);

		this.router.navigate(['/books']);
	}
}
