import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'app-book',
	templateUrl: './book.component.html',
	styleUrl: './book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  id = input<string>();
  title = input<string>();
  authors = input<string[]>();
  publishedDate = input<string>();
  imageUrl = input<string>();
}
