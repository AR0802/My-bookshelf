import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { SignupComponent } from './signup.component';
import { AuthService } from '@shared/services/auth.service';
import { ERoutes } from '@shared/enums/routes.enum';

describe('SignupComponent', () => {
	let component: SignupComponent;
	let fixture: ComponentFixture<SignupComponent>;
	let authServiceMock: jasmine.SpyObj<AuthService>;
	let router: Router;

	beforeEach(async () => {
		authServiceMock = jasmine.createSpyObj('AuthService', [
			'signup',
			'handleError',
		]);

		await TestBed.configureTestingModule({
			imports: [SignupComponent, ReactiveFormsModule],
			providers: [
				{ provide: AuthService, useValue: authServiceMock },
				{ provide: ActivatedRoute, useValue: {} },
			],
		}).compileComponents();

		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(SignupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('Form Validation', () => {
		it('should be invalid when empty', () => {
			expect(component.authForm.valid).toBeFalsy();
		});

		it('should validate name', () => {
			const name = component.authForm.controls['name'];
			expect(name.valid).toBeFalsy();
			expect(name.errors?.['required']).toBeTruthy();

			name.setValue('a');
			expect(name.errors?.['pattern']).toBeTruthy();

			name.setValue('John123');
			expect(name.valid).toBeTruthy();
		});

		it('should validate email', () => {
			const email = component.authForm.controls['email'];
			expect(email.valid).toBeFalsy();
			expect(email.errors?.['required']).toBeTruthy();

			email.setValue('invalid-email');
			expect(email.errors?.['email']).toBeTruthy();

			email.setValue('test@example.com');
			expect(email.valid).toBeTruthy();
		});

		it('should validate password', () => {
			const password = component.authForm.controls['password'];
			expect(password.errors?.['required']).toBeTruthy();

			password.setValue('weak');
			expect(password.errors?.['pattern']).toBeTruthy();

			password.setValue('StrongPass1!');
			expect(password.valid).toBeTruthy();
		});

		it('should validate confirm password', () => {
			const confirmPassword = component.authForm.controls['confirmPassword'];
			expect(confirmPassword.errors?.['required']).toBeTruthy();

			confirmPassword.setValue('weak');
			expect(confirmPassword.errors?.['pattern']).toBeTruthy();

			confirmPassword.setValue('StrongPass1!');
			expect(confirmPassword.valid).toBeTruthy();
		});
	});

	describe('Toggle Password Visibility', () => {
		it('should toggle password field type', () => {
			expect(component.fieldPasswordTextType()).toBeFalse();

			component.toggleFieldTextType(component.fieldPasswordTextType);
			expect(component.fieldPasswordTextType()).toBeTrue();

			component.toggleFieldTextType(component.fieldPasswordTextType);
			expect(component.fieldPasswordTextType()).toBeFalse();
		});

		it('should toggle confirm password field type', () => {
			expect(component.fieldConfirmPasswordTextType()).toBeFalse();

			component.toggleFieldTextType(component.fieldConfirmPasswordTextType);
			expect(component.fieldConfirmPasswordTextType()).toBeTrue();

			component.toggleFieldTextType(component.fieldConfirmPasswordTextType);
			expect(component.fieldConfirmPasswordTextType()).toBeFalse();
		});
	});

	describe('Signup Function', () => {
		it('should handle successful signup', () => {
			const navigateSpy = spyOn(router, 'navigateByUrl');
			const testCredentials = {
				name: 'John123',
				email: 'test@example.com',
				password: 'StrongPass1!',
				confirmPassword: 'StrongPass1!',
			};

			component.authForm.setValue(testCredentials);
			authServiceMock.signup.and.returnValue(of(void 0));

			component.signup();

			expect(authServiceMock.signup).toHaveBeenCalledWith(
				testCredentials.name,
				testCredentials.email,
				testCredentials.password
			);
			expect(navigateSpy).toHaveBeenCalledWith(ERoutes.BOOKS);
		});
	});
});
