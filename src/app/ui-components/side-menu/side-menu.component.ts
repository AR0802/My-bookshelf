import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { BackdropComponent } from '@ui-components/backdrop/backdrop.component';
import { ThemeComponent } from '@ui-components/theme/theme.component';
import { InteractionService } from '@shared/services/interaction.service';
import { ERoutes } from '@shared/enums/routes.enum';

@Component({
	selector: 'app-side-menu',
	imports: [RouterLink, RouterLinkActive, BackdropComponent, ThemeComponent],
	templateUrl: './side-menu.component.html',
	styleUrl: './side-menu.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
	readonly ERoutes = ERoutes;
	show = signal<boolean>(false);
	private interactionService = inject(InteractionService);

	constructor() {
		effect(() => {
			this.show.set(this.interactionService.showMenu());
		});
	}

	close(): void {
		this.interactionService.toggleMenu(false);
	}
}
