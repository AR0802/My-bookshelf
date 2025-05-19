import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	signal,
} from '@angular/core';

import { BooksComponent } from '@components/books/books.component';
import { InteractionService } from '@shared/services/interaction.service';

@Component({
	selector: 'app-home-books',
	imports: [BooksComponent],
	templateUrl: './home-books.component.html',
	styleUrl: './home-books.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeBooksComponent {
	categories: string[] = [
		$localize`Programming`,
		$localize`Science`,
		$localize`Self-development`,
		$localize`Sport`,
	];
	showLoader = signal(false);
	private interactionService = inject(InteractionService);

	constructor() {
		effect(() => {
			this.showLoader.set(this.interactionService.showLoader());
		});
	}
}
