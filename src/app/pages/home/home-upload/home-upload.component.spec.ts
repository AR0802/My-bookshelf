import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { HomeUploadComponent } from './home-upload.component';
import { BooksService } from '@shared/services/books.service';
import { AuthService } from '@shared/services/auth.service';
import { ERoutes } from '@shared/enums/routes.enum';

describe('HomeUploadComponent', () => {
	let component: HomeUploadComponent;
	let fixture: ComponentFixture<HomeUploadComponent>;
	let routerMock: jasmine.SpyObj<Router>;
	let booksServiceMock: jasmine.SpyObj<BooksService>;
	let authServiceMock: jasmine.SpyObj<AuthService>;

	const mockUser = {
		id: 'user123',
		email: 'test@example.com',
	};

	const mockBookData = {
		title: 'Test Book',
		author: 'Test Author',
		description: 'Test Description',
		file: 'test.pdf',
		image: 'test.jpg',
	};

	beforeEach(async () => {
		routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);
		booksServiceMock = jasmine.createSpyObj('BooksService', ['addUserBook']);
		authServiceMock = jasmine.createSpyObj('AuthService', [], {
			currentUserSig: jasmine.createSpy().and.returnValue(mockUser),
		});

		await TestBed.configureTestingModule({
			imports: [HomeUploadComponent],
			providers: [
				{ provide: Router, useValue: routerMock },
				{ provide: BooksService, useValue: booksServiceMock },
				{ provide: AuthService, useValue: authServiceMock },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(HomeUploadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('Form Validation', () => {
		it('should initialize with invalid form', () => {
			expect(component.uploadBookForm.valid).toBeFalsy();
		});

		it('should validate required fields', () => {
			const form = component.uploadBookForm;
			expect(form.get('title')?.errors?.['required']).toBeTruthy();
			expect(form.get('author')?.errors?.['required']).toBeTruthy();
			expect(form.get('description')?.errors?.['required']).toBeTruthy();
			expect(form.get('file')?.errors?.['required']).toBeTruthy();
			expect(form.get('image')?.errors?.['required']).toBeTruthy();
		});

		it('should be valid with all fields filled', () => {
			component.uploadBookForm.patchValue(mockBookData);
			expect(component.uploadBookForm.valid).toBeTruthy();
		});
	});

	describe('upload', () => {
		it('should successfully upload book and navigate', () => {
			component.uploadBookForm.patchValue(mockBookData);
			booksServiceMock.addUserBook.and.returnValue(of('newBookId'));

			component.upload();

			const expectedBook = {
				...mockBookData,
				userId: mockUser.id,
			};

			expect(booksServiceMock.addUserBook).toHaveBeenCalledWith(expectedBook);
			expect(routerMock.navigateByUrl).toHaveBeenCalledWith(
				`/${ERoutes.BOOKS}/${ERoutes.MYBOOKS}`
			);
			expect(component.error()).toBe('');
		});

		it('should handle upload error', () => {
			const errorMessage = 'Upload failed';
			booksServiceMock.addUserBook.and.returnValue(
				throwError(() => new Error(errorMessage))
			);

			component.upload();

			expect(component.error()).toBe(errorMessage);
			expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
		});
	});

	describe('Form Elements', () => {
		it('should render all form controls', () => {
			const formControls = fixture.debugElement.queryAll(
				By.css('.form-control')
			);
			expect(formControls.length).toBe(5);
		});

		it('should show error messages when fields are touched and invalid', () => {
			const titleInput = fixture.debugElement.query(By.css('#title'));
			titleInput.nativeElement.dispatchEvent(new Event('blur'));
			fixture.detectChanges();

			const errorMessage = fixture.debugElement.query(
				By.css('.error:not(.visibility)')
			);
			expect(errorMessage.nativeElement.textContent.trim()).toBe(
				'Enter Title!'
			);
		});

		it('should hide error messages when fields are valid', () => {
			const titleInput = fixture.debugElement.query(By.css('#title'));
			titleInput.nativeElement.value = 'Test Title';
			titleInput.nativeElement.dispatchEvent(new Event('input'));
			fixture.detectChanges();

			const errorMessage = fixture.debugElement.query(By.css('.error'));
			expect(errorMessage.classes['visibility']).toBeTrue();
		});
	});

	describe('Submit Button', () => {
		it('should be disabled when form is invalid', () => {
			const submitButton = fixture.debugElement.query(
				By.css('button[type="submit"]')
			);
			expect(submitButton.nativeElement.disabled).toBeTrue();
		});

		it('should be enabled when form is valid', () => {
			component.uploadBookForm.patchValue({
				title: 'Test Title',
				author: 'Test Author',
				description: 'Test Description',
				file: 'test.pdf',
				image: 'test.jpg',
			});
			fixture.detectChanges();

			const submitButton = fixture.debugElement.query(
				By.css('button[type="submit"]')
			);
			expect(submitButton.nativeElement.disabled).toBeFalse();
		});
	});

	describe('Alert Component', () => {
		it('should show alert when error exists', () => {
			component.error.set('Test Error');
			fixture.detectChanges();

			const alert = fixture.debugElement.query(By.css('app-alert'));
			expect(alert).toBeTruthy();
		});

		it('should not show alert when no error', () => {
			const alert = fixture.debugElement.query(By.css('app-alert'));
			expect(alert).toBeFalsy();
		});
	});

	describe('Form Submission', () => {
		it('should call upload method on form submit', () => {
			spyOn(component, 'upload');
			const form = fixture.debugElement.query(By.css('form'));

			component.uploadBookForm.patchValue({
				title: 'Test Title',
				author: 'Test Author',
				description: 'Test Description',
				file: 'test.pdf',
				image: 'test.jpg',
			});
			fixture.detectChanges();

			form.triggerEventHandler('ngSubmit');
			expect(component.upload).toHaveBeenCalled();
		});
	});
});
