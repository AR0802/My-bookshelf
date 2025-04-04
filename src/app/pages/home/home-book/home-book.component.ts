import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-home-book',
	templateUrl: './home-book.component.html',
	styleUrl: './home-book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeBookComponent {}
