import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '@shared/services/auth.service';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
	private authService = inject(AuthService);
	private destroyRef = inject(DestroyRef);

	ngOnInit(): void {
		this.authService.user$
			.pipe(
				tap((user) => {
					user
						? this.authService.currentUserSig.set({
								email: user.email!,
								name: user.displayName!,
								id: user.uid,
							})
						: this.authService.currentUserSig.set(null);
				}),
				catchError(() => {
					return EMPTY;
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}
}
