declare interface Env {
	readonly NODE_ENV: string;
	readonly NG_APP_GOOGLE_BOOKS_API_KEY: string;
	readonly NG_APP_FIREBASE_API_KEY: string;
}

declare interface ImportMeta {
	readonly env: Env;
}
