import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BurgerMenuService } from '@shared/services/burger-menu.service';

@Component({
	selector: 'app-burger-menu',
	templateUrl: './burger-menu.component.html',
	styleUrl: './burger-menu.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BurgerMenuComponent {
	private burgerMenuService = inject(BurgerMenuService);

	protected open(): void {
		this.burgerMenuService.toggle(true);
	}
}
