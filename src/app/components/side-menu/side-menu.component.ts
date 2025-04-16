import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { BackdropComponent } from '@components/backdrop/backdrop.component';
import { BurgerMenuService } from '@shared/burger-menu.service';
import { ERoutes } from '@shared/routes.enum';
import { ThemeService } from '@shared/theme.service';

@Component({
	selector: 'app-side-menu',
	imports: [RouterLink, RouterLinkActive, BackdropComponent],
	templateUrl: './side-menu.component.html',
	styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent {
	burgerMenuService = inject(BurgerMenuService);
	private themeService = inject(ThemeService);
	theme = signal<string>('');
	readonly routes = ERoutes;

	changeTheme(): void {
		if (!this.theme()) {
			this.theme.set('dark');
		} else {
			this.theme.set('');
		}
		this.themeService.loadTheme(this.theme());
	}

	close(): void {
		this.burgerMenuService.toggle(false);
	}
}
