import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBooksComponent } from './home-books.component';

describe('HomeBooksComponent', () => {
	let component: HomeBooksComponent;
	let fixture: ComponentFixture<HomeBooksComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HomeBooksComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(HomeBooksComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have predefined categories', () => {
		expect(component.categories).toEqual([
			'Programming',
			'Science',
			'Self-development',
			'Sport',
		]);
	});
});
