import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { BooksService } from '@shared/services/books.service';
import { IBook, IResponse } from '@shared/interfaces';
import { BooksComponent } from './books.component';

describe('BooksComponent', () => {
	let component: BooksComponent;
	let fixture: ComponentFixture<BooksComponent>;
	let booksService: jasmine.SpyObj<BooksService>;

	const mockBooks: IBook[] = [
		{
			id: '1',
			volumeInfo: {
				authors: ['Robert Martin'],
				title: 'Clean Code',
				publishedDate: '2008-08-01',
				imageLinks: {
					thumbnail: 'https://example.com/clean-code.jpg',
				},
				categories: ['Programming', 'Software Engineering'],
			},
		},
		{
			id: '2',
			volumeInfo: {
				authors: ['Eric Evans'],
				title: 'Domain-Driven Design',
				publishedDate: '2003-08-30',
				imageLinks: {
					thumbnail: 'https://example.com/ddd.jpg',
				},
				categories: ['Software Architecture', 'Programming'],
			},
		},
		{
			id: '3',
			volumeInfo: {
				authors: ['Martin Fowler', 'Kent Beck'],
				title: 'Refactoring',
				publishedDate: '2018-11-19',
				imageLinks: {
					thumbnail: 'https://example.com/refactoring.jpg',
				},
				categories: ['Programming', 'Software Development'],
			},
		},
		{
			id: '4',
			volumeInfo: {
				authors: ['Gang of Four'],
				title: 'Design Patterns',
				publishedDate: '1994-10-21',
				imageLinks: {
					thumbnail: 'https://example.com/design-patterns.jpg',
				},
				categories: ['Software Design', 'Programming'],
			},
		},
		{
			id: '5',
			volumeInfo: {
				authors: ['Martin Fowler'],
				title: 'Patterns of Enterprise Application Architecture',
				publishedDate: '2002-11-15',
				imageLinks: {
					thumbnail: 'https://example.com/enterprise-patterns.jpg',
				},
				categories: ['Software Architecture', 'Programming'],
			},
		},
	];

	const mockResponse: IResponse = {
		items: mockBooks,
	};

	beforeEach(async () => {
		const spy = jasmine.createSpyObj('BooksService', ['getBooks'], {
			homeBooks: new Map(),
		});

		const mockActivatedRoute = {
			snapshot: {
				paramMap: {
					get: () => 'programming',
				},
			},
		};

		await TestBed.configureTestingModule({
			imports: [BooksComponent],
			providers: [
				{ provide: BooksService, useValue: spy },
				{ provide: ActivatedRoute, useValue: mockActivatedRoute },
			],
		}).compileComponents();

		booksService = TestBed.inject(BooksService) as jasmine.SpyObj<BooksService>;
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BooksComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('category', 'programming');
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should fetch books from API when homeBooks is empty', () => {
		booksService.getBooks.and.returnValue(of(mockResponse));

		let emittedBooks: IBook[] | undefined;
		component.booksOutput.subscribe((books) => {
			emittedBooks = books;
		});

		fixture.detectChanges();

		expect(booksService.getBooks).toHaveBeenCalledWith('programming');
		expect(component.books()).toEqual(mockBooks.slice(0, 5));
		expect(emittedBooks).toEqual(mockBooks.slice(0, 5));
		expect(booksService.homeBooks.get('programming')).toEqual(mockBooks);
	});

	it('should use cached books when available in homeBooks', () => {
		booksService.homeBooks.set('programming', mockBooks);

		let emittedBooks: IBook[] | undefined;
		component.booksOutput.subscribe((books) => {
			emittedBooks = books;
		});

		fixture.detectChanges();

		expect(booksService.getBooks).not.toHaveBeenCalled();
		expect(component.books()).toEqual(mockBooks.slice(0, 5));
		expect(emittedBooks).toEqual(mockBooks.slice(0, 5));
	});

	it('should handle API errors gracefully', () => {
		booksService.getBooks.and.returnValue(
			throwError(() => new Error('API Error'))
		);

		fixture.detectChanges();

		expect(component.books()).toEqual([]);
	});

	it('should limit books to 5 items', () => {
		const manyBooks = Array(10)
			.fill(null)
			.map((_, index) => ({
				id: String(index),
				title: `Book ${index}`,
				authors: [`Author ${index}`],
			}));

		booksService.homeBooks.set('programming', manyBooks);

		fixture.detectChanges();

		expect(component.books().length).toBe(5);
	});

	it('should emit books through booksOutput', () => {
		booksService.homeBooks.set('programming', mockBooks);

		let emittedBooks: IBook[] | undefined;
		component.booksOutput.subscribe((books) => {
			emittedBooks = books;
		});

		fixture.detectChanges();

		expect(emittedBooks).toBeTruthy();
		expect(emittedBooks?.length).toBe(5);
	});
});
