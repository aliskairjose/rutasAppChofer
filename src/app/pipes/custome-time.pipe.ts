import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
  name: 'customeTime'
} )
export class CustomeTimePipe implements PipeTransform {

  transform( time: string ): string {
    let timeTranform = '';

    const _time = time.split( ':' );
    const hour = parseInt( _time[ 0 ], 10 );
    if ( hour > 12 ) {
      const newHour = hour - 12;
      timeTranform = `${newHour}:${_time[ 1 ]} pm`;
    } else {
      timeTranform = `${_time[ 0 ]}:${_time[ 1 ]} am`;
    }
    return timeTranform;
  }

}
