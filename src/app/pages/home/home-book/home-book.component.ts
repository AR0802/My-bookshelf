import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnDestroy,
	OnInit,
	signal,
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { BooksService } from '@shared/books.service';
import { IBook } from '@shared/book.interface';

@Component({
	selector: 'app-home-book',
	templateUrl: './home-book.component.html',
	styleUrl: './home-book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeBookComponent implements OnInit, OnDestroy {
	private location = inject(Location);
	private activatedRoute = inject(ActivatedRoute);
	private booksService = inject(BooksService);
	private subscription: Subscription | undefined;
	id: string | undefined;
	book = signal<IBook | undefined>(undefined);

	ngOnInit(): void {
		this.subscription = this.activatedRoute.params.subscribe(
			(params: Params) => {
				this.id = params['id'];
				this.booksService.getBook(this.id!).subscribe((book: IBook) => {
					this.book.set(book);
				});
			}
		);
	}

	backClicked(): void {
		this.location.back();
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}
}
