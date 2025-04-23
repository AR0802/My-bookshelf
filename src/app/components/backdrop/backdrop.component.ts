import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	signal,
} from '@angular/core';

import { BurgerMenuService } from '@shared/services/burger-menu.service';

@Component({
	selector: 'app-backdrop',
	templateUrl: './backdrop.component.html',
	styleUrl: './backdrop.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackdropComponent {
	show = signal<boolean>(false);
	private burgerMenuService = inject(BurgerMenuService);

	constructor() {
		effect(() => {
			this.show.set(this.burgerMenuService.show());
		});
	}

	close(): void {
		this.burgerMenuService.toggle(false);
	}
}
