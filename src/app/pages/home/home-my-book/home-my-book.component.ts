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
import { tap } from 'rxjs';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
	selector: 'app-home-my-book',
	imports: [PdfViewerModule],
	templateUrl: './home-my-book.component.html',
	styleUrl: './home-my-book.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeMyBookComponent implements OnInit {
	file = signal<string>('');
	private activatedRoute = inject(ActivatedRoute);
	private destroyRef = inject(DestroyRef);

	ngOnInit(): void {
		this.activatedRoute.queryParams
			.pipe(
				tap((queryParam: Params) => {
					this.file.set(queryParam['file']);
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}
}
