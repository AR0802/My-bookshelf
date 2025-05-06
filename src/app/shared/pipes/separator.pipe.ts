import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'separatorPipe',
})
export class SeparatorPipe implements PipeTransform {
	transform(value: string | undefined): string {
		return value ? ', ' : '';
	}
}
