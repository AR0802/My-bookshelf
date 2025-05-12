import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { TopPanelComponent } from './top-panel.component';
import { AuthService } from '@shared/services/auth.service';
import { BooksService } from '@shared/services/books.service';
import { SupabaseStorageService } from '@shared/services/supabase-storage.service';
import { ERoutes } from '@shared/enums/routes.enum';

describe('TopPanelComponent', () => {
	let component: TopPanelComponent;
	let fixture: ComponentFixture<TopPanelComponent>;
	let authServiceMock: jasmine.SpyObj<AuthService>;
	let booksServiceMock: jasmine.SpyObj<BooksService>;
	let storageServiceMock: jasmine.SpyObj<SupabaseStorageService>;
	let router: Router;

	beforeEach(async () => {
		authServiceMock = jasmine.createSpyObj('AuthService', [
			'logout',
			'currentUserSig',
		]);
		booksServiceMock = jasmine.createSpyObj('BooksService', [
			'getBooks',
			'getBooksBySearch',
			'searchBooks',
		]);
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

	it('should handle logout error', () => {
		const errorMessage = 'Logout failed';
		authServiceMock.logout.and.returnValue(
			throwError(() => new Error(errorMessage))
		);

		component.logout();

		expect(component.error()).toBe(errorMessage);
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

		booksServiceMock.getBooks.and.returnValue(of(mockResponse));
		booksServiceMock.searchBooks = jasmine.createSpyObj('signal', ['set']);

		component.searchParam.set('All');
		component.search(mockEvent);

		expect(booksServiceMock.getBooks).toHaveBeenCalledWith(searchValue);
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

		expect(booksServiceMock.getBooks).not.toHaveBeenCalled();
		expect(booksServiceMock.getBooksBySearch).not.toHaveBeenCalled();
	});
});
