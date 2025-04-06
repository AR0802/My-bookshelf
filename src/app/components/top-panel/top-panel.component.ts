import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../shared/auth.service';

@Component({
	selector: 'app-top-panel',
	templateUrl: './top-panel.component.html',
	styleUrl: './top-panel.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopPanelComponent {
	private authService = inject(AuthService);
	private router = inject(Router);

	logout() {
		this.authService.logout().subscribe(() => {
			this.router.navigateByUrl('/login');
		});
	}
}
