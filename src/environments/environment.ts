export const environment = {
	googleBooksApi: {
		apiKey: import.meta.env.NG_APP_GOOGLE_BOOKS_API_KEY,
		url: 'https://www.googleapis.com/books/v1/volumes',
	},
	firebase: {
		apiKey: import.meta.env.NG_APP_FIREBASE_API_KEY,
		authDomain: 'my-bookshelf-61c4d.firebaseapp.com',
		projectId: 'my-bookshelf-61c4d',
		storageBucket: 'my-bookshelf-61c4d.firebasestorage.app',
		messagingSenderId: '907158047000',
		appId: '1:907158047000:web:b1b95026e1d3cd7df0b66d',
	},
	supabase: {
		supabaseUrl: 'https://myztpkcttqizgpbexdsd.supabase.co',
		supabaseKey: import.meta.env.NG_APP_SUPABASE_KEY,
	},
};
