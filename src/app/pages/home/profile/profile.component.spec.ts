import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { AuthService } from '@shared/services/auth.service';
import { SupabaseStorageService } from '@shared/services/supabase-storage.service';
import { BUCKET_NAME } from '@shared/constants/supabase.constant';

describe('ProfileComponent', () => {
	let component: ProfileComponent;
	let fixture: ComponentFixture<ProfileComponent>;
	let authServiceMock: jasmine.SpyObj<AuthService>;
	let supabaseStorageServiceMock: jasmine.SpyObj<SupabaseStorageService>;
	let locationMock: jasmine.SpyObj<Location>;

	const mockUser = {
		id: 'user123',
		name: 'Test User',
		email: 'test@example.com',
	};

	beforeEach(async () => {
		authServiceMock = jasmine.createSpyObj('AuthService', ['updateName'], {
			currentUserSig: () => mockUser,
		});

		supabaseStorageServiceMock = jasmine.createSpyObj(
			'SupabaseStorageService',
			['upload', 'download'],
			{
				imgUrl: signal(''),
			}
		);

		locationMock = jasmine.createSpyObj('Location', ['back']);

		await TestBed.configureTestingModule({
			imports: [ProfileComponent],
			providers: [
				{ provide: AuthService, useValue: authServiceMock },
				{
					provide: SupabaseStorageService,
					useValue: supabaseStorageServiceMock,
				},
				{ provide: Location, useValue: locationMock },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ProfileComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('Initialization', () => {
		it('should set initial name from current user', () => {
			supabaseStorageServiceMock.download.and.returnValue(
				Promise.resolve({
					data: new Blob(['test'], { type: 'image/jpeg' }),
					error: null,
				})
			);

			fixture.detectChanges();

			expect(component.profileForm.get('name')?.value).toBe(mockUser.name);
			expect(component.initialName()).toBe(mockUser.name);
		});

		it('should try to download image if no imgUrl exists', async () => {
			const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
			supabaseStorageServiceMock.download.and.returnValue(
				Promise.resolve({ data: mockBlob, error: null })
			);

			fixture.detectChanges();
			await fixture.whenStable();

			expect(supabaseStorageServiceMock.download).toHaveBeenCalledWith(
				BUCKET_NAME,
				mockUser.id
			);
			expect(component.imgUrl()).toBeTruthy();
		});
	});

	describe('Form Validation', () => {
		it('should validate name pattern', () => {
			const nameControl = component.profileForm.get('name');

			nameControl?.setValue('a');
			expect(nameControl?.errors?.['pattern']).toBeTruthy();

			nameControl?.setValue('ValidName123');
			expect(nameControl?.errors).toBeNull();
		});
	});

	describe('File Handling', () => {
		it('should handle file selection', () => {
			const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
			const event = { target: { files: [file] } } as unknown as Event;

			component.fileSelect(event);

			expect(component.selectedFile()).toBe(file);
			expect(component.imgUrl()).toBeTruthy();
		});

		it('should handle image removal', () => {
			const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
			const event = { target: { files: [file] } } as unknown as Event;
			component.fileSelect(event);

			component.removeImage();

			expect(component.selectedFile()).toBeNull();
			expect(component.imgUrl()).toBe('');
			expect(component.profileForm.get('image')?.value).toBe('');
		});
	});

	describe('Profile Save', () => {
		it('should handle update error', () => {
			const errorMessage = 'Update failed';
			authServiceMock.updateName.and.returnValue(
				throwError(() => new Error(errorMessage))
			);

			component.saveProfile();

			expect(locationMock.back).not.toHaveBeenCalled();
		});

		it('should upload new image if selected', async () => {
			const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
			const event = { target: { files: [file] } } as unknown as Event;
			component.fileSelect(event);

			supabaseStorageServiceMock.upload.and.returnValue(
				Promise.resolve({
					data: {
						id: '1',
						path: 'user123/avatar.jpg',
						fullPath: 'avatars/user123/avatar.jpg',
					},
					error: null,
				})
			);
			authServiceMock.updateName.and.returnValue(of(void 0));

			component.saveProfile();
			await fixture.whenStable();

			expect(supabaseStorageServiceMock.upload).toHaveBeenCalledWith(
				BUCKET_NAME,
				mockUser.id,
				file
			);
		});
	});
});
