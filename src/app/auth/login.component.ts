import {
	ChangeDetectionStrategy,
	Component,
	signal,
	WritableSignal,
} from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
	selector: 'app-login',
	imports: [NgClass],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
	fieldTextType: WritableSignal<boolean> = signal(false);

	toggleFieldTextType(): void {
		this.fieldTextType.update((fieldTextType) => !fieldTextType);
	}
}
