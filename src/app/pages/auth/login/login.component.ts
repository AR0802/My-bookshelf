import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
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
export default class LoginComponent implements OnInit {
	private authService = inject(AuthService);
	private router = inject(Router);
	fieldTextType: WritableSignal<boolean> = signal(false);

	ngOnInit(): void {
		this.authService.getUsers().subscribe((users) => {
			console.log(users);
		});
	}

	toggleFieldTextType(): void {
		this.fieldTextType.update((fieldTextType) => !fieldTextType);
	}

	submit(form: NgForm) {
		if (form.invalid) return;

		this.router.navigate(['/books']);
	}
}
