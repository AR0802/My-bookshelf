import { TestBed } from '@angular/core/testing';
import { SupabaseClient } from '@supabase/supabase-js';

import { SupabaseStorageService } from './supabase-storage.service';

describe('SupabaseStorageService', () => {
	let service: SupabaseStorageService;
	let mockSupabaseClient: jasmine.SpyObj<SupabaseClient>;

	const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
	const mockBucket = 'avatars';
	const mockPath = 'user123/avatar.jpg';

	beforeEach(() => {
		mockSupabaseClient = {
			storage: {
				from: jasmine.createSpy('from').and.returnValue({
					update: jasmine.createSpy('update').and.returnValue(
						Promise.resolve({
							data: {
								id: '1',
								path: mockPath,
								fullPath: `${mockBucket}/${mockPath}`,
							},
							error: null,
						})
					),
					download: jasmine.createSpy('download').and.returnValue(
						Promise.resolve({
							data: new Blob(['downloadedData']),
							error: null,
						})
					),
				}),
			},
		} as any;

		TestBed.configureTestingModule({
			providers: [
				SupabaseStorageService,
				{ provide: SupabaseClient, useValue: mockSupabaseClient },
			],
		});

		service = TestBed.inject(SupabaseStorageService);
		(service as any).supabaseClient = mockSupabaseClient;
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('upload', () => {
		it('should upload file successfully', async () => {
			const result = await service.upload(mockBucket, mockPath, mockFile);

			expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith(mockBucket);
			expect(
				mockSupabaseClient.storage.from(mockBucket).update
			).toHaveBeenCalledWith(mockPath, mockFile, {
				cacheControl: '3600',
				upsert: true,
			});
			expect(result).toEqual({
				data: {
					id: '1',
					path: mockPath,
					fullPath: `${mockBucket}/${mockPath}`,
				},
				error: null,
			});
		});

		it('should handle upload error', async () => {
			const errorMessage = 'Upload failed';
			mockSupabaseClient.storage.from('').update = jasmine
				.createSpy('update')
				.and.returnValue(
					Promise.resolve({ data: null, error: new Error(errorMessage) })
				);

			const result = await service.upload(mockBucket, mockPath, mockFile);

			expect(result.error).toBeTruthy();
			expect(result.error?.message).toBe(errorMessage);
		});
	});

	describe('download', () => {
		it('should download file successfully', async () => {
			const result = await service.download(mockBucket, mockPath);

			expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith(mockBucket);
			expect(
				mockSupabaseClient.storage.from(mockBucket).download
			).toHaveBeenCalledWith(mockPath);
			expect(result).toEqual({
				data: new Blob(['downloadedData']),
				error: null,
			});
		});

		it('should handle download error', async () => {
			const errorMessage = 'Download failed';
			mockSupabaseClient.storage.from('').download = jasmine
				.createSpy('download')
				.and.returnValue(
					Promise.resolve({ data: null, error: new Error(errorMessage) })
				);

			const result = await service.download(mockBucket, mockPath);

			expect(result.error).toBeTruthy();
			expect(result.error?.message).toBe(errorMessage);
		});
	});

	describe('imgUrl signal', () => {
		it('should initialize with empty string', () => {
			expect(service.imgUrl()).toBe('');
		});
	});
});
