import { TestBed } from '@angular/core/testing';

import { BurgerMenuService } from './burger-menu.service';

describe('BurgerMenuService', () => {
	let service: BurgerMenuService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(BurgerMenuService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should initialize show signal as false', () => {
		expect(service.show()).toBeFalse();
	});

	describe('toggle', () => {
		it('should set show signal to true', () => {
			service.toggle(true);
			expect(service.show()).toBeTrue();
		});

		it('should set show signal to false', () => {
			service.toggle(true);
			expect(service.show()).toBeTrue();

			service.toggle(false);
			expect(service.show()).toBeFalse();
		});

		it('should maintain the last set value', () => {
			service.toggle(true);
			expect(service.show()).toBeTrue();

			service.toggle(true);
			expect(service.show()).toBeTrue();
		});
	});
});
