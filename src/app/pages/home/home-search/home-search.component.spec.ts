import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { BooksApiService } from '@shared/services/books-api.service';
import { BooksService } from '@shared/services/books.service';
import { IBook, IResponse } from '@shared/interfaces';
import { InteractionService } from '@shared/services/interaction.service';
import { HomeSearchComponent } from './home-search.component';

describe('HomeSearchComponent', () => {
	let component: HomeSearchComponent;
	let fixture: ComponentFixture<HomeSearchComponent>;
	let routerMock: jasmine.SpyObj<Router>;
	let booksServiceMock: jasmine.SpyObj<BooksService>;
	let booksApiServiceMock: jasmine.SpyObj<BooksApiService>;
	let interactionServiceMock: jasmine.SpyObj<InteractionService>;

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
		booksApiServiceMock = jasmine.createSpyObj('BooksApiService', ['getBooks']);
		booksServiceMock = jasmine.createSpyObj('BooksService', [], {
			searchBooks: signal(false),
			searchAuthorBooks: signal(false),
			books: signal<IBook[]>([]),
		});
		interactionServiceMock = jasmine.createSpyObj('BooksApiService', [], {
			layoutRef: signal(undefined),
		});

		await TestBed.configureTestingModule({
			imports: [HomeSearchComponent],
			providers: [
				{ provide: Router, useValue: routerMock },
				{ provide: BooksApiService, useValue: booksApiServiceMock },
				{ provide: BooksService, useValue: booksServiceMock },
				{ provide: InteractionService, useValue: interactionServiceMock },
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
	});

	describe('Search by Category', () => {
		it('should handle successful search', () => {
			const response: IResponse = { items: mockBooks };
			booksApiServiceMock.getBooks.and.returnValue(of(response));

			component.searchByCategory('Programming');

			expect(component.books()).toEqual(mockBooks);
			expect(component.booksForPage().length).toBe(2);
			expect(component.notFoundMessage()).toBe('');
		});

		it('should handle empty search results', () => {
			const response: IResponse = { items: [] };
			booksApiServiceMock.getBooks.and.returnValue(of(response));

			component.searchByCategory('NonexistentCategory');

			expect(component.notFoundMessage()).toBe('Nothing Found!');
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
			interactionServiceMock.layoutRef.set(mockElement);

			component.pageChange(2);

			expect(mockElement.nativeElement.scrollTo).toHaveBeenCalledWith({
				top: 0,
				behavior: 'smooth',
			});
		});
	});
});
