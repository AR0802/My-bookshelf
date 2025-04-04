export interface IBook {
	id: string;
	volumeInfo: {
		authors: string[];
		title: string;
		publishedDate: string;
		imageLinks: {
			thumbnail: string;
		};
	};
}
