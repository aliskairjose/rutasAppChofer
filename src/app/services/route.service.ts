import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Route } from '../interfaces/route';
import { map } from 'rxjs/operators';
import { CommonService } from './common.service';

@Injectable( {
  providedIn: 'root'
} )
export class RouteService {

  constructor(
    private _http: HttpService,
    private _common: CommonService
  ) { }

  /**
   * @description Lista las rutas de los buses
   * @param Id del cliente
   * @returns Arreglo de Rutas
   */
  list( id: number ): Observable<Route[]> {
    return this._http.get( `/routes?client_id=${id}&includes[]=driver&includes[]=routeType&includes[]=RouteStops&includes[]=bus` )
      .pipe( map( response => response.data ) );
  }

  /**
   * @description Agrega una nueva ruta a la db
   * @param data Ruta
   * @returns Confirmación de agregado
   */
  add( data: Route ): Observable<Route> {
    return this._http.post( '/routes', data ).pipe(
      map( response => {
        this.toastMessage( response.message );
        return response.data;
      } )
    );
  }

  private toastMessage( message: string ): void {
    const color = 'primary';
    this._common.presentToast( { message, color } );
  }
}
