import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { SearchBookComponent } from './search-book.component';
import { ERoutes } from '@shared/enums/routes.enum';

describe('SearchBookComponent', () => {
	let component: SearchBookComponent;
	let fixture: ComponentFixture<SearchBookComponent>;
	let router: Router;
	let mockBook = {
		id: '123',
		volumeInfo: {
			title: 'Test Book',
			authors: ['Test Author'],
			publishedDate: '2024',
			categories: ['Test Category'],
			imageLinks: {
				thumbnail: 'test-image.jpg',
			},
		},
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SearchBookComponent],
			providers: [
				{
					provide: Router,
					useValue: { navigateByUrl: jasmine.createSpy('navigateByUrl') },
				},
			],
		}).compileComponents();

		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(SearchBookComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('book', mockBook);
	});

	afterEach(() => {
		localStorage.clear();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('Favorite functionality', () => {
		it('should initialize isFavorite as false when book is not in localStorage', () => {
			component.ngOnInit();
			expect(component.isFavorite()).toBeFalse();
		});

		it('should initialize isFavorite as true when book is in localStorage', () => {
			localStorage.setItem('123', JSON.stringify(mockBook));
			component.ngOnInit();
			expect(component.isFavorite()).toBeTrue();
		});

		it('should add book to favorites when toggleFavorite is called and book is not favorite', () => {
			component.toggleFavorite();

			const storedBook = localStorage.getItem('123');
			expect(storedBook).toBeTruthy();
			expect(JSON.parse(storedBook!)).toEqual(mockBook);
			expect(component.isFavorite()).toBeTrue();
		});

		it('should remove book from favorites when toggleFavorite is called and book is favorite', () => {
			localStorage.setItem('123', JSON.stringify(mockBook));
			component.isFavorite.set(true);

			component.toggleFavorite();

			expect(localStorage.getItem('123')).toBeNull();
			expect(component.isFavorite()).toBeFalse();
		});
	});

	describe('Navigation', () => {
		it('should navigate to book preview when previewBook is called', () => {
			component.previewBook();

			expect(router.navigateByUrl).toHaveBeenCalledWith(
				`${ERoutes.BOOKS}/${mockBook.id}`
			);
		});
	});
});
