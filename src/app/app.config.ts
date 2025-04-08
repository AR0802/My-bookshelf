import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
	provideRouter,
	withPreloading,
	PreloadAllModules,
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { environment } from '@environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withPreloading(PreloadAllModules)),
		provideHttpClient(),
		provideFirebaseApp(() => initializeApp(environment.firebase)),
		provideAuth(() => getAuth()),
	],
};
