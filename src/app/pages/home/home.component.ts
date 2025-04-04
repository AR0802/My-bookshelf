import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavComponent } from '../../components/nav/nav.component';
import { TopPanelComponent } from '../../components/top-panel/top-panel.component';

@Component({
	selector: 'app-home',
	imports: [RouterOutlet, NavComponent, TopPanelComponent],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {}
