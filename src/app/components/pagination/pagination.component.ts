import {
	ChangeDetectionStrategy,
	Component,
	input,
	output,
} from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { pageSize, currentPage } from '@shared/constants/pagination.constants';

@Component({
	selector: 'app-pagination',
	imports: [NgbPaginationModule],
	templateUrl: './pagination.component.html',
	styleUrl: './pagination.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
	pageSize = pageSize;
	currentPage = currentPage;
	totalItems = input.required<number>();
	changePage = output<number>();

	pageChange(pageIndex: number) {
		this.changePage.emit(pageIndex);
	}
}
