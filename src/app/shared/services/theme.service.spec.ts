import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
	let service: ThemeService;
	let mockHead: HTMLHeadElement;
	let mockLink: HTMLLinkElement;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ThemeService);

		mockHead = document.createElement('head');
		mockLink = document.createElement('link');

		spyOn(document, 'getElementsByTagName').and.returnValue([
			mockHead,
		] as unknown as HTMLCollectionOf<Element>);
		spyOn(document, 'createElement').and.returnValue(mockLink);
		spyOn(mockHead, 'appendChild');
		spyOn(localStorage, 'setItem');
	});

	afterEach(() => {
		localStorage.clear();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('loadTheme', () => {
		it('should update existing theme link', () => {
			const themeName = 'dark-theme';
			const mockThemeLink = document.createElement('link');

			spyOn(document, 'getElementById').and.returnValue(mockThemeLink);

			service.loadTheme(themeName);

			expect(mockThemeLink.href).toContain(`${themeName}.css`);
			expect(service.theme()).toBe(themeName);
			expect(localStorage.setItem).toHaveBeenCalledWith(
				'theme',
				JSON.stringify(themeName)
			);
		});

		it('should create new theme link if none exists', () => {
			const themeName = 'light-theme';

			spyOn(document, 'getElementById').and.returnValue(null);

			service.loadTheme(themeName);

			expect(document.createElement).toHaveBeenCalledWith('link');
			expect(mockLink.id).toBe('client-theme');
			expect(mockLink.type).toBe('text/css');
			expect(mockLink.rel).toBe('stylesheet');
			expect(mockLink.href).toContain(`${themeName}.css`);
			expect(mockHead.appendChild).toHaveBeenCalledWith(mockLink);
			expect(service.theme()).toBe(themeName);
			expect(localStorage.setItem).toHaveBeenCalledWith(
				'theme',
				JSON.stringify(themeName)
			);
		});
	});
});
