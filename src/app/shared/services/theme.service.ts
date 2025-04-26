import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ThemeService {
	theme = signal('');

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

		this.theme.set(themeName);
		localStorage.setItem('theme', JSON.stringify(themeName));
	}
}
