import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { catchError, EMPTY, Subscription } from 'rxjs';

import { AuthService } from '@shared/services/auth.service';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
	private subscription: Subscription | undefined;
	private authService = inject(AuthService);

	ngOnInit(): void {
		this.subscription = this.authService.user$
			.pipe(
				catchError(() => {
					return EMPTY;
				})
			)
			.subscribe((user) => {
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

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}
}
