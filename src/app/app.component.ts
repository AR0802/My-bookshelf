import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './shared/auth.service';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
	private authService = inject(AuthService);

	ngOnInit(): void {
		this.authService.user$.subscribe((user) => {
			if (user) {
				this.authService.currentUserSig.set({
					email: user.email!,
					name: user.displayName!,
				});
			} else {
				this.authService.currentUserSig.set(null);
			}
		});
	}
}
