import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-loader',
	template: '<span class="loader"></span>',
	styleUrl: './loader.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {}
