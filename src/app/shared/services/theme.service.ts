import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ThemeService {
	loadTheme(themeName: string): void {
		const head = document.getElementsByTagName('head')[0];
		const themeSrc = document.getElementById('client-theme') as HTMLLinkElement;

		if (themeSrc) {
			themeSrc.href = `${themeName}.css`;
		} else {
			const link = document.createElement('link');
			link.id = 'client-theme';
			link.type = 'text/css';
			link.rel = 'stylesheet';
			link.href = `${themeName}.css`;

			head.appendChild(link);
		}
	}
}
