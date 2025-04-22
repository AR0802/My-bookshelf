import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
	signal,
} from '@angular/core';

import { BurgerMenuService } from '@shared/services/burger-menu.service';

@Component({
	selector: 'app-backdrop',
	templateUrl: './backdrop.component.html',
	styleUrl: './backdrop.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackdropComponent implements OnInit {
	show = signal<boolean>(false);
	private burgerMenuService = inject(BurgerMenuService);

	ngOnInit(): void {
		this.show.set(this.burgerMenuService.show());
	}

	close(): void {
		this.burgerMenuService.toggle(false);
	}
}
