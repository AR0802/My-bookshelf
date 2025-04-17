import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { SideMenuComponent } from '@components/side-menu/side-menu.component';
import { ThemeService } from '@shared/theme.service';
import { ERoutes } from '@shared/routes.enum';

@Component({
	selector: 'app-nav',
	imports: [RouterLink, RouterLinkActive, SideMenuComponent],
	templateUrl: './nav.component.html',
	styleUrl: './nav.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {
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
}
