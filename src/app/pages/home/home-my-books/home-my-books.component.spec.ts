import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { HomeMyBooksComponent } from './home-my-books.component';
import { BooksApiService } from '@shared/services/books-api.service';
import { AuthService } from '@shared/services/auth.service';
import { IUserBook } from '@shared/interfaces';
import { ActivatedRoute } from '@angular/router';

describe('HomeMyBooksComponent', () => {
	let component: HomeMyBooksComponent;
	let fixture: ComponentFixture<HomeMyBooksComponent>;
	let booksApiServiceMock: jasmine.SpyObj<BooksApiService>;
	let authServiceMock: jasmine.SpyObj<AuthService>;

	const mockUser = {
		id: 'user123',
		email: 'test@example.com',
	};

	const mockUserBooks: IUserBook[] = [
		{
			id: '1',
			userId: 'user123',
			title: 'Book 1',
			author: 'Author 1',
			description: 'Description 1',
			file: 'file1.pdf',
			image: 'image1.jpg',
		},
		{
			id: '2',
			userId: 'otherUser',
			title: 'Book 2',
			author: 'Author 2',
			description: 'Description 2',
			file: 'file2.pdf',
			image: 'image2.jpg',
		},
	];

	beforeEach(async () => {
		booksApiServiceMock = jasmine.createSpyObj('BooksApiService', [
			'getUserBooks',
		]);
		authServiceMock = jasmine.createSpyObj('AuthService', [], {
			currentUserSig: jasmine.createSpy().and.returnValue(mockUser),
		});

		await TestBed.configureTestingModule({
			imports: [HomeMyBooksComponent],
			providers: [
				{ provide: BooksApiService, useValue: booksApiServiceMock },
				{ provide: AuthService, useValue: authServiceMock },
				{ provide: ActivatedRoute, useValue: {} },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(HomeMyBooksComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('initialization', () => {
		it('should initialize with empty books array', () => {
			expect(component.books()).toEqual([]);
		});
	});

	describe('setUserBooks', () => {
		it('should filter and set books for current user', () => {
			booksApiServiceMock.getUserBooks.and.returnValue(of(mockUserBooks));

			fixture.detectChanges();

			expect(component.books().length).toBe(1);
			expect(component.books()[0].userId).toBe(mockUser.id);
		});

		it('should handle error when fetching books fails', () => {
			const errorMessage = 'Failed to fetch books';
			booksApiServiceMock.getUserBooks.and.returnValue(
				throwError(() => new Error(errorMessage))
			);

			fixture.detectChanges();

			expect(component.books().length).toBe(0);
		});

		it('should handle empty books array', () => {
			booksApiServiceMock.getUserBooks.and.returnValue(of([]));

			fixture.detectChanges();

			expect(component.books().length).toBe(0);
		});
	});
});
