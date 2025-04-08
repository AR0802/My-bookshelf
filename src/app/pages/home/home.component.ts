import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavComponent } from '@components/nav/nav.component';
import { TopPanelComponent } from '@components/top-panel/top-panel.component';
import { IResponse } from '@shared/response.interface';
import { IBook } from '@shared/book.interface';

@Component({
	selector: 'app-home',
	imports: [RouterOutlet, NavComponent, TopPanelComponent],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
	foundBooks = signal<IBook[] | undefined>(undefined);

	booksChanged(data: IResponse): void {
		this.foundBooks.set(data.items);
	}
}
