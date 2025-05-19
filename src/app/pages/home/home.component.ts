import {
	ChangeDetectionStrategy,
	Component,
	effect,
	ElementRef,
	inject,
	OnInit,
	signal,
	ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavComponent } from '@components/nav/nav.component';
import { TopPanelComponent } from '@components/top-panel/top-panel.component';
import { BurgerMenuComponent } from '@ui-components/burger-menu/burger-menu.component';
import { LoaderComponent } from '@ui-components/loader/loader.component';
import { InteractionService } from '@shared/services/interaction.service';

@Component({
	selector: 'app-home',
	imports: [
		RouterOutlet,
		NavComponent,
		TopPanelComponent,
		BurgerMenuComponent,
		LoaderComponent,
	],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
	@ViewChild('layout', { static: true }) layoutRef: ElementRef | undefined;
	showLoader = signal(false);
	private interactionService = inject(InteractionService);

	constructor() {
		effect(() => {
			this.showLoader.set(this.interactionService.showLoader());
		});
	}

	ngOnInit(): void {
		this.interactionService.layoutRef.set(this.layoutRef);
	}
}
