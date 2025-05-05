import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	OnInit,
	signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '@shared/services/auth.service';
import { AlertComponent } from '@ui-components/alert/alert.component';
import { ThemeService } from '@shared/services/theme.service';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, AlertComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
	error = signal<string>('');
	private authService = inject(AuthService);
	private themeService = inject(ThemeService);
	private destroyRef = inject(DestroyRef);

	ngOnInit(): void {
		this.themeService.loadTheme(JSON.parse(localStorage.getItem('theme')!));
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
				catchError((error: Error) => {
					this.error.set(error.message);
					return EMPTY;
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}
}
