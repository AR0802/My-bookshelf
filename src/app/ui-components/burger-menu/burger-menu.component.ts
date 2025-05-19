import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { InteractionService } from '@shared/services/interaction.service';

@Component({
	selector: 'app-burger-menu',
	templateUrl: './burger-menu.component.html',
	styleUrl: './burger-menu.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BurgerMenuComponent {
	private interactionService = inject(InteractionService);

	open(): void {
		this.interactionService.toggleMenu(true);
	}
}
