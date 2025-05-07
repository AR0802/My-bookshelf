import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { IBook } from '@shared/interfaces';
import { BookComponent } from './book.component';

describe('BookComponent', () => {
	let component: BookComponent;
	let fixture: ComponentFixture<BookComponent>;

	const mockBook: IBook = {
		id: '12345',
		volumeInfo: {
			title: 'Clean Code',
			authors: ['Robert Martin'],
			publishedDate: '2008-08-01',
			imageLinks: {
				thumbnail: 'https://example.com/clean-code.jpg',
			},
			categories: ['Programming'],
		},
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BookComponent],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: {
						snapshot: {
							paramMap: new Map().set('category', 'programming'),
						},
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(BookComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should display book information correctly', () => {
		fixture.componentRef.setInput('book', mockBook);
		fixture.detectChanges();

		const element = fixture.nativeElement;

		const img = element.querySelector('.card-img-top');
		expect(img.src).toBe('https://example.com/clean-code.jpg');
		expect(img.alt).toBe('Clean Code');
		expect(img.title).toBe('Clean Code');

		const title = element.querySelector('.card-title');
		expect(title.textContent.trim()).toBe('Clean Code');

		const description = element.querySelector('.card-description');
		expect(description.textContent.trim()).toContain('Robert Martin');
		expect(description.textContent.trim()).toContain('2008');
	});

	it('should handle missing author gracefully', () => {
		const bookWithoutAuthor = {
			...mockBook,
			volumeInfo: {
				...mockBook.volumeInfo,
				authors: undefined,
			},
		};

		fixture.componentRef.setInput('book', bookWithoutAuthor);
		fixture.detectChanges();

		const description =
			fixture.nativeElement.querySelector('.card-description');
		expect(description.textContent.trim()).toContain('2008');
		expect(description.textContent.trim()).not.toContain('undefined');
	});

	it('should handle missing date gracefully', () => {
		const bookWithoutDate = {
			...mockBook,
			volumeInfo: {
				...mockBook.volumeInfo,
				publishedDate: undefined,
			},
		};

		fixture.componentRef.setInput('book', bookWithoutDate);
		fixture.detectChanges();

		const description =
			fixture.nativeElement.querySelector('.card-description');
		expect(description.textContent.trim()).toContain('Robert Martin');
		expect(description.textContent.trim()).not.toContain('undefined');
	});

	it('should have correct router link', () => {
		fixture.componentRef.setInput('book', mockBook);
		fixture.detectChanges();

		const card = fixture.nativeElement.querySelector('.card');
		expect(card.getAttribute('ng-reflect-router-link')).toBe('12345');
	});
});
