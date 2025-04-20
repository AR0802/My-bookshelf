import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class BurgerMenuService {
	show = signal<boolean>(false);

	toggle(show: boolean): void {
		this.show.set(show);
	}
}
