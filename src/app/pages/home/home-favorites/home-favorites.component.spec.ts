import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFavoriteComponent } from './home-favorites.component';
import { FavoriteBooksComponent } from '@components/favorite-books/favorite-books.component';
import { IBook } from '@shared/interfaces';

describe('HomeFavoriteComponent', () => {
	let component: HomeFavoriteComponent;
	let fixture: ComponentFixture<HomeFavoriteComponent>;

	const mockBooks: IBook[] = [
		{
			id: '1',
			volumeInfo: {
				title: 'Test Book 1',
				authors: ['Author 1'],
				categories: ['Programming'],
				publishedDate: '2023',
				imageLinks: {
					thumbnail: 'test-url-1',
				},
			},
		},
		{
			id: '2',
			volumeInfo: {
				title: 'Test Book 2',
				authors: ['Author 2'],
				categories: ['Science'],
				publishedDate: '2023',
				imageLinks: {
					thumbnail: 'test-url-2',
				},
			},
		},
	];

	beforeEach(async () => {
		localStorage.clear();

		await TestBed.configureTestingModule({
			imports: [HomeFavoriteComponent, FavoriteBooksComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(HomeFavoriteComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize with empty books array', () => {
		fixture.detectChanges();
		expect(component.books()).toEqual([]);
	});

	it('should load favorite books from localStorage on init', () => {
		mockBooks.forEach((book) => {
			localStorage.setItem(book.id, JSON.stringify(book));
		});

		fixture.detectChanges();

		expect(component.books().length).toBe(2);
		expect(component.books()).toEqual(mockBooks);
	});

	it('should handle empty localStorage', () => {
		fixture.detectChanges();
		expect(component.books().length).toBe(0);
	});
});
