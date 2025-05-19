import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { SideMenuComponent } from '@ui-components/side-menu/side-menu.component';
import { ThemeComponent } from '@ui-components/theme/theme.component';
import { ERoutes } from '@shared/enums/routes.enum';

@Component({
	selector: 'app-nav',
	imports: [RouterLink, RouterLinkActive, SideMenuComponent, ThemeComponent],
	templateUrl: './nav.component.html',
	styleUrl: './nav.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {
	readonly ERoutes = ERoutes;
}
