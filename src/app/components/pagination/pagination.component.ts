import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import {
	PAGE_SIZE,
	CURRENT_PAGE,
} from '@shared/constants/pagination.constants';

@Component({
	selector: 'app-pagination',
	imports: [NgbPaginationModule],
	templateUrl: './pagination.component.html',
	styleUrl: './pagination.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
	pageSize = PAGE_SIZE;
	currentPage = CURRENT_PAGE;
	totalItems = input.required<number>();
	changePage = output<number>();

	protected pageChange(pageIndex: number) {
		this.changePage.emit(pageIndex);
	}
}
