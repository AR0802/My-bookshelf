import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { BackdropComponent } from '@ui-components/backdrop/backdrop.component';
import { BurgerMenuService } from '@shared/services/burger-menu.service';
import { ERoutes } from '@shared/enums/routes.enum';
import { ThemeService } from '@shared/services/theme.service';

@Component({
	selector: 'app-side-menu',
	imports: [RouterLink, RouterLinkActive, BackdropComponent],
	templateUrl: './side-menu.component.html',
	styleUrl: './side-menu.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
	readonly ERoutes = ERoutes;
	show = signal<boolean>(false);
	private burgerMenuService = inject(BurgerMenuService);
	private themeService = inject(ThemeService);

	constructor() {
		effect(() => {
			this.show.set(this.burgerMenuService.show());
		});
	}

	changeTheme(): void {
		if (!this.themeService.theme()) {
			this.themeService.theme.set('dark');
		} else {
			this.themeService.theme.set('');
		}
		this.themeService.loadTheme(this.themeService.theme());
	}

	close(): void {
		this.burgerMenuService.toggle(false);
	}
}
