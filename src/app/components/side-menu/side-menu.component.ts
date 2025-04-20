import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { BackdropComponent } from '@components/backdrop/backdrop.component';
import { BurgerMenuService } from '@shared/services/burger-menu.service';
import { ERoutes } from '@shared/enums/routes.enum';
import { ThemeService } from '@shared/services/theme.service';

@Component({
	selector: 'app-side-menu',
	imports: [RouterLink, RouterLinkActive, BackdropComponent],
	templateUrl: './side-menu.component.html',
	styleUrl: './side-menu.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuComponent implements OnInit {
	readonly routes = ERoutes;
	theme = signal<string>('');
	show = signal<boolean>(false);
	private burgerMenuService = inject(BurgerMenuService);
	private themeService = inject(ThemeService);

	ngOnInit(): void {
		this.show.set(this.burgerMenuService.show());
	}

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
