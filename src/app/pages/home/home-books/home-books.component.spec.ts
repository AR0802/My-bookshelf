import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBooksComponent } from './home-books.component';
import { BooksComponent } from '@components/books/books.component';
import { LoaderComponent } from '@ui-components/loader/loader.component';
import { IBook } from '@shared/interfaces';

describe('HomeBooksComponent', () => {
	let component: HomeBooksComponent;
	let fixture: ComponentFixture<HomeBooksComponent>;

	const mockBooks: IBook[] = [
		{
			id: '1',
			volumeInfo: {
				title: 'Test Book 1',
				authors: ['Author 1'],
				categories: ['Programming'],
				publishedDate: '2023',
				imageLinks: {
					thumbnail: 'https://example.com/thumbnail1.jpg',
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
					thumbnail: 'https://example.com/thumbnail2.jpg',
				},
			},
		},
	];

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HomeBooksComponent, BooksComponent, LoaderComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(HomeBooksComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize with empty books array', () => {
		expect(component.books()).toEqual([]);
	});

	it('should have predefined categories', () => {
		expect(component.categories).toEqual([
			'Programming',
			'Science',
			'Self-development',
			'Sport',
		]);
	});

	describe('Books Change Handler', () => {
		it('should update books signal when booksChange is called', () => {
			component.booksChange(mockBooks);
			expect(component.books()).toEqual(mockBooks);
		});

		it('should handle empty books array', () => {
			component.booksChange([]);
			expect(component.books()).toEqual([]);
		});
	});
});
