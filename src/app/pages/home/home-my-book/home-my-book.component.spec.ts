import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { HomeMyBookComponent } from './home-my-book.component';
import { CURRENT_PAGE } from '@shared/constants/pagination.constants';

describe('HomeMyBookComponent', () => {
	let component: HomeMyBookComponent;
	let fixture: ComponentFixture<HomeMyBookComponent>;
	let mockQueryParams: BehaviorSubject<object>;

	beforeEach(async () => {
		mockQueryParams = new BehaviorSubject({});

		await TestBed.configureTestingModule({
			imports: [HomeMyBookComponent, PdfViewerModule],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: { queryParams: mockQueryParams },
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(HomeMyBookComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('Initialization', () => {
		it('should initialize with default values', () => {
			expect(component.page).toBe(CURRENT_PAGE);
			expect(component.totalPages).toBe(CURRENT_PAGE);
			expect(component.isLoaded()).toBeFalse();
			expect(component.file()).toBe('');
		});

		it('should set file from query params', () => {
			const testFile = 'test.pdf';
			mockQueryParams.next({ file: testFile });
			fixture.detectChanges();

			expect(component.file()).toBe(testFile);
		});
	});

	describe('PDF Navigation', () => {
		beforeEach(() => {
			component.totalPages = 5;
			component.page = 2;
		});

		it('should increment page on nextPage()', () => {
			component.nextPage();
			expect(component.page).toBe(3);
		});

		it('should decrement page on prevPage()', () => {
			component.prevPage();
			expect(component.page).toBe(1);
		});
	});

	describe('PDF Loading', () => {
		it('should handle afterLoadComplete', () => {
			const pdfData = { numPages: 10 };
			component.afterLoadComplete(pdfData);

			expect(component.totalPages).toBe(pdfData.numPages);
			expect(component.isLoaded()).toBeTrue();
		});
	});

	describe('PDF Viewer Element', () => {
		it('should try to get pdf-viewer element on init', () => {
			const mockElement = document.createElement('div');
			spyOn(document.documentElement, 'querySelector').and.returnValue(
				mockElement
			);

			component.ngOnInit();

			expect(document.documentElement.querySelector).toHaveBeenCalledWith(
				'pdf-viewer'
			);
			expect(component.pdfViewer).toBe(mockElement);
		});
	});
});
