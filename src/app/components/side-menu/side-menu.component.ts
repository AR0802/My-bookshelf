import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { BackdropComponent } from '@components/backdrop/backdrop.component';
import { BurgerMenuService } from '@shared/burger-menu.service';

@Component({
	selector: 'app-side-menu',
	imports: [RouterLink, RouterLinkActive, BackdropComponent],
	templateUrl: './side-menu.component.html',
	styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent {
	burgerMenuService = inject(BurgerMenuService);

	close(): void {
		this.burgerMenuService.toggle(false);
	}
}
