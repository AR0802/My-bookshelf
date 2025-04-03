import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NavComponent } from './nav/nav.component';
import { TopPanelComponent } from './top-panel/top-panel.component';
import { BooksComponent } from './books/books.component';

@Component({
	selector: 'app-root',
	imports: [NavComponent, BooksComponent, TopPanelComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
