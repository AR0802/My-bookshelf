import '@angular/localize/init';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SearchBooksComponent } from './search-books.component';
import { SearchBookComponent } from './search-book/search-book.component';
import { IBook } from '@shared/interfaces';

describe('SearchBooksComponent', () => {
	let component: SearchBooksComponent;
	let fixture: ComponentFixture<SearchBooksComponent>;
	const mockBooks: IBook[] = [
		{
			id: '1',
			volumeInfo: {
				title: 'Test Book 1',
				authors: ['Author 1'],
				publishedDate: '2024',
				categories: ['Category 1'],
				imageLinks: {
					thumbnail: 'image1.jpg',
				},
			},
		},
		{
			id: '2',
			volumeInfo: {
				title: 'Test Book 2',
				authors: ['Author 2'],
				publishedDate: '2024',
				categories: ['Category 2'],
				imageLinks: {
					thumbnail: 'image2.jpg',
				},
			},
		},
	];

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SearchBooksComponent, SearchBookComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SearchBooksComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('books', mockBooks);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have required books input', () => {
		expect(component.books).toBeDefined();
		expect(component.books()).toEqual(mockBooks);
	});

	it('should render search-book components for each book', () => {
		const searchBookElements = fixture.debugElement.queryAll(
			By.directive(SearchBookComponent)
		);
		expect(searchBookElements.length).toBe(mockBooks.length);
	});

	it('should pass correct book data to each search-book component', () => {
		const searchBookElements = fixture.debugElement.queryAll(
			By.directive(SearchBookComponent)
		);

		searchBookElements.forEach((element, index) => {
			const searchBookComponent = element.componentInstance;
			expect(searchBookComponent.book()).toEqual(mockBooks[index]);
		});
	});
});
