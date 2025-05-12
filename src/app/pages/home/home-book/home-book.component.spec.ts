import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { HomeBookComponent } from './home-book.component';
import { BooksService } from '@shared/services/books.service';
import { IBook, IResponse } from '@shared/interfaces';
import { ERoutes } from '@shared/enums/routes.enum';

describe('HomeBookComponent', () => {
	let component: HomeBookComponent;
	let fixture: ComponentFixture<HomeBookComponent>;
	let booksServiceMock: jasmine.SpyObj<BooksService>;
	let router: Router;
	let location: Location;

	const mockBook: IBook = {
		id: '123',
		volumeInfo: {
			title: 'Test Book',
			authors: ['Test Author'],
			publishedDate: '2023',
			categories: ['Fiction'],
			imageLinks: {
				thumbnail: 'test.jpg',
			},
		},
	};

	const mockResponse: IResponse = {
		items: [
			mockBook,
			{
				id: '456',
				volumeInfo: {
					title: 'Another Book',
					authors: ['Test Author'],
					publishedDate: '2023',
					categories: ['Fiction'],
					imageLinks: {
						thumbnail: 'test2.jpg',
					},
				},
			},
		],
	};

	beforeEach(async () => {
		booksServiceMock = jasmine.createSpyObj(
			'BooksService',
			['getBook', 'getBooksBySearch'],
			{ searchAuthorBooks: jasmine.createSpyObj('signal', ['set']) }
		);

		await TestBed.configureTestingModule({
			imports: [HomeBookComponent],
			providers: [
				{ provide: BooksService, useValue: booksServiceMock },
				{
					provide: ActivatedRoute,
					useValue: {
						params: of({ id: '123' }),
					},
				},
			],
		}).compileComponents();

		router = TestBed.inject(Router);
		location = TestBed.inject(Location);
		fixture = TestBed.createComponent(HomeBookComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('Initialization', () => {
		it('should get book details on init', () => {
			booksServiceMock.getBook.and.returnValue(of(mockBook));
			booksServiceMock.getBooksBySearch.and.returnValue(of(mockResponse));

			component.ngOnInit();

			expect(component.id()).toBe('123');
			expect(component.book()).toEqual(mockBook);
			expect(component.haveAuthorBooks()).toBeTrue();
		});

		it('should handle error when getting book details', () => {
			const errorMessage = 'Failed to fetch book';
			booksServiceMock.getBook.and.returnValue(
				throwError(() => new Error(errorMessage))
			);

			component.ngOnInit();

			expect(component.error()).toBe(errorMessage);
		});
	});

	describe('Author books', () => {
		it('should set author books excluding current book', () => {
			booksServiceMock.getBook.and.returnValue(of(mockBook));
			booksServiceMock.getBooksBySearch.and.returnValue(of(mockResponse));

			component.ngOnInit();

			expect(component.authorBooks().length).toBe(1);
			expect(component.authorBooks()[0].id).not.toBe(mockBook.id);
		});

		it('should set haveAuthorBooks to false when no other books found', () => {
			booksServiceMock.getBook.and.returnValue(of(mockBook));
			booksServiceMock.getBooksBySearch.and.returnValue(
				of({ items: [mockBook] })
			);

			component.ngOnInit();

			expect(component.haveAuthorBooks()).toBeFalse();
		});
	});

	describe('Navigation', () => {
		it('should navigate back when back() is called', () => {
			const locationSpy = spyOn(location, 'back');

			component.back();

			expect(locationSpy).toHaveBeenCalled();
		});

		it('should navigate to search results when searchByAuthor() is called', () => {
			const navigateSpy = spyOn(router, 'navigateByUrl');
			booksServiceMock.getBook.and.returnValue(of(mockBook));
			booksServiceMock.getBooksBySearch.and.returnValue(of(mockResponse));

			component.ngOnInit();
			component.searchByAuthor();

			expect(navigateSpy).toHaveBeenCalledWith(
				`/${ERoutes.BOOKS}/${ERoutes.SEARCH}`,
				{ state: mockResponse }
			);
			expect(booksServiceMock.searchAuthorBooks.set).toHaveBeenCalledWith(true);
		});

		it('should handle error in searchByAuthor()', () => {
			const errorMessage = 'Search failed';
			booksServiceMock.getBook.and.returnValue(of(mockBook));
			booksServiceMock.getBooksBySearch.and.returnValue(
				throwError(() => new Error(errorMessage))
			);

			component.ngOnInit();
			component.searchByAuthor();

			expect(component.error()).toBe(errorMessage);
		});
	});
});
