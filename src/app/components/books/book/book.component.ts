import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { IBook } from '@shared/interfaces';
import { SeparatorPipe } from '@shared/pipes/separator.pipe';

@Component({
	selector: 'app-book',
	imports: [RouterLink, SlicePipe, SeparatorPipe],
	templateUrl: './book.component.html',
	styleUrl: './book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
	book = input<IBook>();
}
