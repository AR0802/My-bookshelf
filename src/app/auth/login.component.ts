import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-login',
	imports: [CommonModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	fieldTextType: WritableSignal<boolean> = signal(false);

	toggleFieldTextType() {
		this.fieldTextType.update((fieldTextType) => !fieldTextType);
	}
}
