import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { environment } from '@environments/environment';

@Injectable({
	providedIn: 'root',
})
export class SupabaseStorageService {
	public supabaseClient: SupabaseClient;

	constructor() {
		this.supabaseClient = createClient(
			environment.supabase.supabaseUrl,
			environment.supabase.supabaseKey
		);
	}

	async upload(bucket: string, path: string, file: File) {
		const { data, error } = await this.supabaseClient.storage
			.from(bucket)
			.upload(path, file);

		return { data, error };
	}

	async download(bucket: string, path: string) {
		const { data, error } = await this.supabaseClient.storage
			.from(bucket)
			.download(path);

		return { data, error };
	}

	async getBucket() {
		const { data, error } =
			await this.supabaseClient.storage.getBucket('my-bookshelf');
		return { data, error };
	}
}
