import { ElementRef, Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class InteractionService {
	showMenu = signal<boolean>(false);
	error = signal('');
	showLoader = signal(false);
	layoutRef = signal<ElementRef | undefined>(undefined);

	toggleMenu(show: boolean): void {
		this.showMenu.set(show);
	}

	setError(error: string): void {
		this.error.set(error);
	}
}
