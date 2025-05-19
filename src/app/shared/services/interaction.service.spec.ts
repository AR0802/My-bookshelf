import { TestBed } from '@angular/core/testing';

import { InteractionService } from './interaction.service';

describe('BurgerMenuService', () => {
	let service: InteractionService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(InteractionService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should initialize show signal as false', () => {
		expect(service.showMenu()).toBeFalse();
	});

	describe('toggle', () => {
		it('should set show signal to true', () => {
			service.toggleMenu(true);
			expect(service.showMenu()).toBeTrue();
		});

		it('should set show signal to false', () => {
			service.toggleMenu(true);
			expect(service.showMenu()).toBeTrue();

			service.toggleMenu(false);
			expect(service.showMenu()).toBeFalse();
		});

		it('should maintain the last set value', () => {
			service.toggleMenu(true);
			expect(service.showMenu()).toBeTrue();

			service.toggleMenu(true);
			expect(service.showMenu()).toBeTrue();
		});
	});
});
