import { FormControl } from '@angular/forms';

export interface ILoginForm {
	email: FormControl<string | null>;
	password: FormControl<string | null>;
}

export interface ISignupForm extends ILoginForm {
	name: FormControl<string | null>;
	confirmPassword: FormControl<string | null>;
}

export interface IProfileForm {
	name: FormControl<string | null>;
	image: FormControl<string | null>;
}

export interface IBookUploadForm {
	title: FormControl<string | null>;
	author: FormControl<string | null>;
	description: FormControl<string | null>;
	file: FormControl<string | null>;
	image: FormControl<string | null>;
}
