import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-loader',
	templateUrl: './loader.component.html',
	styleUrl: './loader.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {}
