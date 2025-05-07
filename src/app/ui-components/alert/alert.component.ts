import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';

@Component({
	selector: 'app-alert',
	templateUrl: './alert.component.html',
	styleUrl: './alert.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
	message = input.required<string>();
	close = output();

	protected hide() {
		this.close.emit();
	}
}
