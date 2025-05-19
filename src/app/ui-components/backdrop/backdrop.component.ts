import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	signal,
} from '@angular/core';

import { InteractionService } from '@shared/services/interaction.service';

@Component({
	selector: 'app-backdrop',
	templateUrl: './backdrop.component.html',
	styleUrl: './backdrop.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackdropComponent {
	show = signal<boolean>(false);
	private interactionService = inject(InteractionService);

	constructor() {
		effect(() => {
			this.show.set(this.interactionService.showMenu());
		});
	}

	close(): void {
		this.interactionService.toggleMenu(false);
	}
}
