import { SeparatorPipe } from './separator.pipe';

describe('SeparatorPipe', () => {
	let pipe: SeparatorPipe;

	beforeEach(() => {
		pipe = new SeparatorPipe();
	});

	it('should create', () => {
		expect(pipe).toBeTruthy();
	});

	it('should return comma and space when value exists', () => {
		expect(pipe.transform('test')).toBe(', ');
	});

	it('should return empty string when value is undefined', () => {
		expect(pipe.transform(undefined)).toBe('');
	});

	it('should return empty string when value is empty string', () => {
		expect(pipe.transform('')).toBe('');
	});
});
