import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { UserCredential } from '@angular/fire/auth';

import { LoginComponent } from './login.component';
import { AuthService } from '@shared/services/auth.service';
import { ERoutes } from '@shared/enums/routes.enum';

describe('LoginComponent', () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;
	let authServiceMock: jasmine.SpyObj<AuthService>;
	let router: Router;

	beforeEach(async () => {
		authServiceMock = jasmine.createSpyObj('AuthService', [
			'login',
			'loginWithGoogle',
			'handleError',
		]);

		await TestBed.configureTestingModule({
			imports: [LoginComponent, ReactiveFormsModule],
			providers: [
				{ provide: AuthService, useValue: authServiceMock },
				{ provide: ActivatedRoute, useValue: {} },
			],
		}).compileComponents();

		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(LoginComponent);
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
	});

	describe('Login Functions', () => {
		it('should handle successful login', () => {
			const navigateSpy = spyOn(router, 'navigateByUrl');
			const testCredentials = {
				email: 'test@example.com',
				password: 'StrongPass1!',
			};

			const mockUserCredential = {
				user: { email: testCredentials.email },
			} as UserCredential;
			component.authForm.setValue(testCredentials);
			authServiceMock.login.and.returnValue(of(mockUserCredential));

			component.login();

			expect(authServiceMock.login).toHaveBeenCalledWith(
				testCredentials.email,
				testCredentials.password
			);
			expect(navigateSpy).toHaveBeenCalledWith(ERoutes.BOOKS);
		});
	});

	it('should handle successful Google login', () => {
		const navigateSpy = spyOn(router, 'navigateByUrl');
		const mockUserCredential = {
			user: { email: 'test@example.com' },
		} as UserCredential;
		authServiceMock.loginWithGoogle.and.returnValue(of(mockUserCredential));

		component.loginWithGoogle();

		expect(authServiceMock.loginWithGoogle).toHaveBeenCalled();
		expect(navigateSpy).toHaveBeenCalledWith(ERoutes.BOOKS);
	});

	describe('UI Interaction', () => {
		it('should toggle password visibility', () => {
			expect(component.fieldTextType()).toBeFalse();

			component.toggleFieldTextType();
			expect(component.fieldTextType()).toBeTrue();

			component.toggleFieldTextType();
			expect(component.fieldTextType()).toBeFalse();
		});
	});
});
