import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	OnInit,
	signal,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { tap } from 'rxjs';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { LoaderComponent } from '@ui-components/loader/loader.component';
import { CURRENT_PAGE } from '@shared/constants/pagination.constants';

@Component({
	selector: 'app-home-my-book',
	imports: [PdfViewerModule, LoaderComponent],
	templateUrl: './home-my-book.component.html',
	styleUrl: './home-my-book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeMyBookComponent implements OnInit {
	page: number = CURRENT_PAGE;
	totalPages: number = CURRENT_PAGE;
	isLoaded = false;
	pdfViewer: Element | null = null;
	file = signal<string>('');
	location = inject(Location);
	private activatedRoute = inject(ActivatedRoute);
	private destroyRef = inject(DestroyRef);

	ngOnInit(): void {
		this.pdfViewer = document.documentElement.querySelector('pdf-viewer');
		this.activatedRoute.queryParams
			.pipe(
				tap((queryParam: Params) => {
					this.file.set(queryParam['file']);
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}

	afterLoadComplete(pdfData: { numPages: number }) {
		this.totalPages = pdfData.numPages;
		this.isLoaded = true;
	}

	nextPage() {
		this.page++;
	}

	prevPage() {
		this.page--;
	}
}
