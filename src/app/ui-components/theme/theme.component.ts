import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
} from '@angular/core';

import { ThemeService } from '@shared/services/theme.service';

@Component({
	selector: 'app-theme',
	templateUrl: './theme.component.html',
	styleUrl: './theme.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeComponent {
	component = input.required();
	private themeService = inject(ThemeService);

	changeTheme(): void {
		const theme = this.themeService.theme() ? '' : 'dark';
		this.themeService.loadTheme(theme);
	}
}
