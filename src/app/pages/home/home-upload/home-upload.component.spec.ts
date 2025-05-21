import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { throwError } from 'rxjs';

import { BooksApiService } from '@shared/services/books-api.service';
import { AuthService } from '@shared/services/auth.service';
import { HomeUploadComponent } from './home-upload.component';

describe('HomeUploadComponent', () => {
	let component: HomeUploadComponent;
	let fixture: ComponentFixture<HomeUploadComponent>;
	let routerMock: jasmine.SpyObj<Router>;
	let booksApiServiceMock: jasmine.SpyObj<BooksApiService>;
	let authServiceMock: jasmine.SpyObj<AuthService>;

	const mockUser = {
		id: 'user123',
		email: 'test@example.com',
	};

	beforeEach(async () => {
		routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);
		booksApiServiceMock = jasmine.createSpyObj('BooksApiService', [
			'addUserBook',
		]);
		authServiceMock = jasmine.createSpyObj('AuthService', [], {
			currentUserSig: jasmine.createSpy().and.returnValue(mockUser),
		});

		await TestBed.configureTestingModule({
			imports: [HomeUploadComponent],
			providers: [
				{ provide: Router, useValue: routerMock },
				{ provide: BooksApiService, useValue: booksApiServiceMock },
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
	});

	describe('Upload', () => {
		it('should handle upload error', () => {
			const errorMessage = 'Upload failed';
			booksApiServiceMock.addUserBook.and.returnValue(
				throwError(() => new Error(errorMessage))
			);

			component.upload();

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
	});
});
