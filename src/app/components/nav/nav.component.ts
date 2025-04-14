import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { SideMenuComponent } from '@components/side-menu/side-menu.component';

@Component({
	selector: 'app-nav',
	imports: [RouterLink, RouterLinkActive, SideMenuComponent],
	templateUrl: './nav.component.html',
	styleUrl: './nav.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {}
