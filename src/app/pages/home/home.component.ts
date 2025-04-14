import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	OnInit,
	signal,
	ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavComponent } from '@components/nav/nav.component';
import { TopPanelComponent } from '@components/top-panel/top-panel.component';
import { BurgerMenuComponent } from '@components/burger-menu/burger-menu.component';
import { BooksService } from '@shared/books.service';
import { IResponse } from '@shared/response.interface';
import { IBook } from '@shared/book.interface';

@Component({
	selector: 'app-home',
	imports: [RouterOutlet, NavComponent, TopPanelComponent, BurgerMenuComponent],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent implements OnInit {
	booksService = inject(BooksService);
	foundBooks = signal<IBook[] | undefined>(undefined);
	@ViewChild('layout', { static: true }) layoutRef: ElementRef | undefined;

	ngOnInit(): void {
		this.booksService.layoutRef.set(this.layoutRef);
	}

	booksChanged(data: IResponse): void {
		this.foundBooks.set(data.items);
	}
}
