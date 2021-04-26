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
    private http: HttpService,
    private _common: CommonService
  ) { }

  /**
   * @description Lista las rutas de los buses
   * @param Id del cliente
   * @returns Arreglo de Rutas
   */
  list( id: number ): Observable<Route[]> {
    return this.http.get( `/routes?driver_id=${id}&includes[]=driver&includes[]=routeType&includes[]=routeStops&includes[]=bus.busModel&occupedSeats=1` )
      .pipe( map( response => response.data ) );
  }

  /**
   * @description Agrega una nueva ruta a la db
   * @param data Ruta
   * @returns Confirmación de agregado
   */
  add( data: Route ): Observable<Route> {
    return this.http.post( '/routes', data ).pipe(
      map( response => {
        this.toastMessage( response.message );
        return response.data;
      } )
    );
  }

  /**
   * @description Inicia la ruta
   * @param id Id de la ruta
   * @returns 
   */
  start( id: number ): Observable<any> {
    return this.http.post( `/route-boarding/drivers?route_id=${id}&occupedSeats=1` )
  }

  /**
   *
   * @description Asigna un asiento en el bus de la ruta
   * @param {number} id Id de la ruta
   * @returns {Observable<any>}
   * @memberof RouteService
   */
  assignSeat( id: number ): Observable<any> {
    return this.http.post( `/route-boarding/drivers/seat?occupedSeats=1`, { route_id: id } );
  }

  /**
   * @description Verifica si la ruta ya fue iniciada
   * @returns Boolean
   */
  verifyBorading(): Observable<any> {
    return this.http.get( `/route-boarding` );
  }

  /**
   *
   *@description Finaliza el viaje del chofer
   * @returns {Observable<any>}
   * @memberof RouteService
   */
  end(): Observable<any> {
    return this.http.put( `/route-boarding/close?occupedSeats=1` )
  }

  private toastMessage( message: string ): void {
    this._common.presentToast( { message } );
  }
}
