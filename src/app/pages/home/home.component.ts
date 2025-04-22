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
import { BooksService } from '@shared/services/books.service';
import { IBook, IResponse } from '@shared/interfaces';

@Component({
	selector: 'app-home',
	imports: [RouterOutlet, NavComponent, TopPanelComponent, BurgerMenuComponent],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
	@ViewChild('layout', { static: true }) layoutRef: ElementRef | undefined;
	foundBooks = signal<IBook[] | undefined>(undefined);
	booksService = inject(BooksService);

	ngOnInit(): void {
		this.booksService.layoutRef.set(this.layoutRef);
	}

	booksChange(data: IResponse): void {
		this.foundBooks.set(data.items);
	}
}
