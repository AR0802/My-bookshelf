import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';

import { HomeSearchComponent } from './home-search.component';
import { BooksService } from '@shared/services/books.service';
import { IBook, IResponse } from '@shared/interfaces';

describe('HomeSearchComponent', () => {
	let component: HomeSearchComponent;
	let fixture: ComponentFixture<HomeSearchComponent>;
	let routerMock: jasmine.SpyObj<Router>;
	let booksServiceMock: jasmine.SpyObj<BooksService>;
	let foundBooksSig = signal<IBook[] | undefined>(undefined);

	const mockBooks: IBook[] = [
		{
			id: '1',
			volumeInfo: {
				title: 'Test Book 1',
				authors: ['Author 1'],
				categories: ['Programming'],
				publishedDate: '2023',
				imageLinks: { thumbnail: 'image1.jpg' },
			},
		},
		{
			id: '2',
			volumeInfo: {
				title: 'Test Book 2',
				authors: ['Author 2'],
				categories: ['Science'],
				publishedDate: '2023',
				imageLinks: { thumbnail: 'image2.jpg' },
			},
		},
	];

	beforeEach(async () => {
		routerMock = jasmine.createSpyObj('Router', ['getCurrentNavigation']);
		booksServiceMock = jasmine.createSpyObj('BooksService', ['getBooks'], {
			searchBooks: signal(false),
			searchAuthorBooks: signal(false),
			books: signal<IBook[]>([]),
			layoutRef: signal(undefined),
		});

		await TestBed.configureTestingModule({
			imports: [HomeSearchComponent],
			providers: [
				{ provide: Router, useValue: routerMock },
				{ provide: BooksService, useValue: booksServiceMock },
				{ provide: ROUTER_OUTLET_DATA, useValue: foundBooksSig },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(HomeSearchComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('Initialization', () => {
		it('should initialize with empty books arrays', () => {
			expect(component.books().length).toBe(0);
			expect(component.booksForPage().length).toBe(0);
			expect(component.authorBooks()).toBeUndefined();
		});

		it('should set author books from router state', () => {
			routerMock.getCurrentNavigation.and.returnValue({
				extras: { state: { items: mockBooks } },
			} as any);

			fixture = TestBed.createComponent(HomeSearchComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();

			expect(component.authorBooks()).toEqual(mockBooks);
		});
	});

	describe('Search by Category', () => {
		it('should handle successful search', () => {
			const response: IResponse = { items: mockBooks };
			booksServiceMock.getBooks.and.returnValue(of(response));

			component.searchByCategory('Programming');

			expect(component.books()).toEqual(mockBooks);
			expect(component.booksForPage().length).toBe(2);
			expect(component.notFoundMessage()).toBe('');
		});

		it('should handle empty search results', () => {
			const response: IResponse = { items: [] };
			booksServiceMock.getBooks.and.returnValue(of(response));

			component.searchByCategory('NonexistentCategory');

			expect(component.notFoundMessage()).toBe('Nothing Found!');
		});

		it('should handle search error', () => {
			const errorMessage = 'Search failed';
			booksServiceMock.getBooks.and.returnValue(
				throwError(() => new Error(errorMessage))
			);

			component.searchByCategory('Programming');

			expect(component.error()).toBe(errorMessage);
		});
	});

	describe('Pagination', () => {
		it('should update booksForPage on page change', () => {
			booksServiceMock.books.set(Array(15).fill(mockBooks[0]));

			component.pageChange(2);

			expect(component.booksForPage().length).toBe(5);
		});

		it('should handle scrolling on page change', () => {
			const mockElement = {
				nativeElement: {
					scrollTo: jasmine.createSpy('scrollTo'),
				},
			};
			booksServiceMock.layoutRef.set(mockElement);

			component.pageChange(2);

			expect(mockElement.nativeElement.scrollTo).toHaveBeenCalledWith({
				top: 0,
				behavior: 'smooth',
			});
		});
	});
});
