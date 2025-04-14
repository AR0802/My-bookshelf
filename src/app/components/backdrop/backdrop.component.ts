import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BurgerMenuService } from '@shared/burger-menu.service';

@Component({
	selector: 'app-backdrop',
	templateUrl: './backdrop.component.html',
	styleUrl: './backdrop.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackdropComponent {
	burgerMenuService = inject(BurgerMenuService);

	close(): void {
		this.burgerMenuService.toggle(false);
	}
}
