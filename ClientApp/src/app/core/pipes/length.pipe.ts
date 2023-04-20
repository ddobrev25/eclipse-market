import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Count'
})
export class LengthPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    if(value==null) return;
    let count = 0;
    value.forEach((el: any) => {
      count++;
    });
    return count;
  }

}
