import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { HomeBookComponent } from './home-book.component';
import { BooksApiService } from '@shared/services/books-api.service';
import { IBook, IResponse } from '@shared/interfaces';
import { ERoutes } from '@shared/enums/routes.enum';
import { BooksService } from '@shared/services/books.service';

describe('HomeBookComponent', () => {
	let component: HomeBookComponent;
	let fixture: ComponentFixture<HomeBookComponent>;
	let booksApiServiceMock: jasmine.SpyObj<BooksApiService>;
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
		booksApiServiceMock = jasmine.createSpyObj(
			'BooksApiService',
			['getBook', 'getBooksBySearch'],
			{ searchAuthorBooks: jasmine.createSpyObj('signal', ['set']) }
		);
		booksServiceMock = jasmine.createSpyObj('BooksService', [], {
			searchAuthorBooks: jasmine.createSpyObj('signal', ['set']),
		});

		await TestBed.configureTestingModule({
			imports: [HomeBookComponent],
			providers: [
				{ provide: BooksApiService, useValue: booksApiServiceMock },
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
			booksApiServiceMock.getBook.and.returnValue(of(mockBook));
			booksApiServiceMock.getBooksBySearch.and.returnValue(of(mockResponse));

			component.ngOnInit();

			expect(component.book()).toEqual(mockBook);
			expect(component.haveAuthorBooks()).toBeTrue();
		});
	});

	describe('Author books', () => {
		it('should set author books excluding current book', () => {
			booksApiServiceMock.getBook.and.returnValue(of(mockBook));
			booksApiServiceMock.getBooksBySearch.and.returnValue(of(mockResponse));

			component.ngOnInit();

			expect(component.authorBooks().length).toBe(1);
			expect(component.authorBooks()[0].id).not.toBe(mockBook.id);
		});

		it('should set haveAuthorBooks to false when no other books found', () => {
			booksApiServiceMock.getBook.and.returnValue(of(mockBook));
			booksApiServiceMock.getBooksBySearch.and.returnValue(
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
			booksApiServiceMock.getBook.and.returnValue(of(mockBook));
			booksApiServiceMock.getBooksBySearch.and.returnValue(of(mockResponse));

			component.ngOnInit();
			component.searchByAuthor();

			expect(navigateSpy).toHaveBeenCalledWith(
				`/${ERoutes.BOOKS}/${ERoutes.SEARCH}`,
				{ state: mockResponse }
			);
			expect(booksServiceMock.searchAuthorBooks.set).toHaveBeenCalledWith(true);
		});
	});
});
