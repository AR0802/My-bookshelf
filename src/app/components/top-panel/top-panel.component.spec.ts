import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { TopPanelComponent } from './top-panel.component';
import { AuthService } from '@shared/services/auth.service';
import { BooksApiService } from '@shared/services/books-api.service';
import { SupabaseStorageService } from '@shared/services/supabase-storage.service';
import { ERoutes } from '@shared/enums/routes.enum';
import { BooksService } from '@shared/services/books.service';

describe('TopPanelComponent', () => {
	let component: TopPanelComponent;
	let fixture: ComponentFixture<TopPanelComponent>;
	let authServiceMock: jasmine.SpyObj<AuthService>;
	let booksApiServiceMock: jasmine.SpyObj<BooksApiService>;
	let booksServiceMock: jasmine.SpyObj<BooksService>;
	let storageServiceMock: jasmine.SpyObj<SupabaseStorageService>;
	let router: Router;

	beforeEach(async () => {
		authServiceMock = jasmine.createSpyObj('AuthService', [
			'logout',
			'currentUserSig',
		]);
		booksApiServiceMock = jasmine.createSpyObj('BooksApiService', [
			'getBooks',
			'getBooksBySearch',
			'searchBooks',
		]);
		booksServiceMock = jasmine.createSpyObj('BooksService', [], {
			searchBooks: jasmine.createSpyObj('signal', ['set']),
		});
		storageServiceMock = jasmine.createSpyObj('SupabaseStorageService', [
			'download',
			'imgUrl',
		]);
		const mockActivatedRoute = {
			snapshot: {
				paramMap: new Map().set('category', 'programming'),
			},
		};

		await TestBed.configureTestingModule({
			imports: [FormsModule, TopPanelComponent],
			providers: [
				{ provide: AuthService, useValue: authServiceMock },
				{ provide: BooksApiService, useValue: booksApiServiceMock },
				{ provide: BooksService, useValue: booksServiceMock },
				{ provide: SupabaseStorageService, useValue: storageServiceMock },
				{ provide: ActivatedRoute, useValue: mockActivatedRoute },
			],
		}).compileComponents();

		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(TopPanelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should change search parameter', () => {
		const newParam = 'Title';
		component.changeSearchParam(newParam);
		expect(component.searchParam()).toBe(newParam);
	});

	it('should handle logout success', () => {
		const navigateSpy = spyOn(router, 'navigateByUrl');
		authServiceMock.logout.and.returnValue(of(void 0));
		storageServiceMock.imgUrl = jasmine.createSpyObj('signal', ['set']);

		component.logout();

		expect(authServiceMock.logout).toHaveBeenCalled();
		expect(storageServiceMock.imgUrl.set).toHaveBeenCalledWith('');
		expect(navigateSpy).toHaveBeenCalledWith(`/${ERoutes.LOGIN}`);
	});

	it('should search books with "All" parameter', () => {
		const searchValue = 'test book';
		const mockEvent = {
			target: {
				value: searchValue,
				validity: { valid: true },
			},
		} as unknown as Event;
		const mockResponse = { items: [] };

		booksApiServiceMock.getBooks.and.returnValue(of(mockResponse));
		booksServiceMock.searchBooks = jasmine.createSpyObj('signal', ['set']);

		component.searchParam.set('All');
		component.search(mockEvent);

		expect(booksApiServiceMock.getBooks).toHaveBeenCalledWith(searchValue);
		expect(booksServiceMock.searchBooks.set).toHaveBeenCalledWith(true);
	});

	it('should not search if input is invalid', () => {
		const mockEvent = {
			target: {
				value: 'test',
				validity: { valid: false },
			},
		} as unknown as Event;

		component.search(mockEvent);

		expect(booksApiServiceMock.getBooks).not.toHaveBeenCalled();
		expect(booksApiServiceMock.getBooksBySearch).not.toHaveBeenCalled();
	});
});
