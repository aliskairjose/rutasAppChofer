import { Pipe, PipeTransform } from '@angular/core';
import { Route } from '../interfaces/route';

@Pipe( {
  name: 'routesFilter'
} )
export class RoutesFilterPipe implements PipeTransform {

  transform( items: Route[], searchText: string ): Route[] {
    if ( !items ) {
      return [];
    }
    if ( !searchText ) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter( it => it.name.toLocaleLowerCase().includes( searchText ) );
  }

}
