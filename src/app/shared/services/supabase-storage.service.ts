import { Injectable, signal } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { environment } from '@environments/environment';

@Injectable({
	providedIn: 'root',
})
export class SupabaseStorageService {
	supabaseClient: SupabaseClient;
	imgUrl = signal('');

	constructor() {
		this.supabaseClient = createClient(
			environment.supabase.supabaseUrl,
			environment.supabase.supabaseKey
		);
	}

	async upload(bucket: string, path: string, file: File) {
		const { data, error } = await this.supabaseClient.storage
			.from(bucket)
			.update(path, file, {
				cacheControl: '3600',
				upsert: true,
			});

		return { data, error };
	}

	async download(bucket: string, path: string) {
		const { data, error } = await this.supabaseClient.storage
			.from(bucket)
			.download(path);

		return { data, error };
	}
}
