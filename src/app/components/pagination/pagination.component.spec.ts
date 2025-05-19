import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { PaginationComponent } from './pagination.component';
import {
	PAGE_SIZE,
	CURRENT_PAGE,
} from '@shared/constants/pagination.constants';

describe('PaginationComponent', () => {
	let component: PaginationComponent;
	let fixture: ComponentFixture<PaginationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PaginationComponent, NgbPaginationModule],
		}).compileComponents();

		fixture = TestBed.createComponent(PaginationComponent);
		component = fixture.componentInstance;

		fixture.componentRef.setInput('totalItems', 40);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('Initialization', () => {
		it('should initialize with default page size', () => {
			expect(component.pageSize).toBe(PAGE_SIZE);
		});

		it('should initialize with default current page', () => {
			expect(component.currentPage).toBe(CURRENT_PAGE);
		});
	});

	describe('Page Change', () => {
		it('should emit page number when pageChange is called', () => {
			const pageNumber = 2;
			let emittedPage: number | undefined;

			component.changePage.subscribe((page: number) => {
				emittedPage = page;
			});

			component.pageChange(pageNumber);

			expect(emittedPage).toBe(pageNumber);
		});

		it('should handle multiple page changes', () => {
			const pageNumbers = [2, 3, 4];
			const emittedPages: number[] = [];

			component.changePage.subscribe((page: number) => {
				emittedPages.push(page);
			});

			pageNumbers.forEach((pageNumber) => {
				component.pageChange(pageNumber);
			});

			expect(emittedPages).toEqual(pageNumbers);
		});
	});

	describe('Template Integration', () => {
		it('should render ngb-pagination component', () => {
			const paginationElement =
				fixture.nativeElement.querySelector('ngb-pagination');
			expect(paginationElement).toBeTruthy();
		});

		it('should pass correct inputs to ngb-pagination', () => {
			fixture.detectChanges();

			const paginationElement =
				fixture.nativeElement.querySelector('ngb-pagination');

			expect(paginationElement.getAttribute('ng-reflect-page')).toBe(
				CURRENT_PAGE.toString()
			);
			expect(paginationElement.getAttribute('ng-reflect-page-size')).toBe(
				PAGE_SIZE.toString()
			);
		});
	});
});
