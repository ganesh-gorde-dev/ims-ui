import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'label' })
export class LabelPipe implements PipeTransform {
  transform(
    value: string | undefined | null,
    arr: { value: string; label: string }[]
  ): string | undefined | null {
    const found = arr.find(item => item.value === value);
    return found ? found.label : value;
  }
}
