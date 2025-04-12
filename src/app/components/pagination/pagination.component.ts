import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-pagination',
	imports: [NgbPaginationModule],
	templateUrl: './pagination.component.html',
	styleUrl: './pagination.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
	totalItems = input.required<number>();
	pageSize = 10;
	currentPage = 1;
	changePage = output<number>();

	pageChanged(pageIndex: number) {
		this.changePage.emit(pageIndex);
	}
}
