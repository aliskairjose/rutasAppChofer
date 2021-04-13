import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Bus } from '../interfaces/bus';
import { BusType } from '../interfaces/bus-type';
import { map } from 'rxjs/operators';
import { CommonService } from './common.service';

@Injectable( {
  providedIn: 'root'
} )
export class BusService {

  constructor(
    private _http: HttpService,
    private _common: CommonService,
  ) { }

  /**
   * @description Muestra la lista de los buses
   * @returns Lista de buses
   */
  list(): Observable<Bus[]> {
    return this._http.get( '/buses' ).pipe( map( response => response.data ) );
  }

  /**
   * @description Registro de nuevo bus en la DB
   * @param bus Data del bus a agregar
   * @returns Bus agregado
   */
  add( bus: Bus ): Observable<any> {
    return this._http.post( '/buses', bus ).pipe(
      map( response => {
        this.toastMessage( response.message );
        return response.data;
      } )
    );
  }

  /**
   * @description Eliminación de bus de la DB
   * @param id Id del bus a eliminar
   * @returns Notificación
   */
  delete( id: number ): Observable<any> {
    return this._http.delete( `/buses/${id}` ).pipe(
      map( response => this.toastMessage( response.message ) )
    );
  }

  /**
   * @description Eliminación de buses de la DB
   * @param ids Arreglo de ids de buses a eliminar {ids: []}
   * @returns Notificación
   */
  deleteList( ids: number[] ): Observable<any> {
    return this._http.delete( `/buses/massive-delete`, ids );
  }


  /*******  Tipo de bus  *******************************/


  /**
   * @description Tipos de buses
   * @returns Retorna la lista de tipos de buses
   */
  typeList(): Observable<BusType[]> {
    return this._http.get( '/bus-types' );
  }

  /**
   * @description Agrega un nuevo tipo de bus a la db
   * @param data Tipos de bus
   * @returns Tipo de bus agregado
   */
  addType( data: BusType ): Observable<any> {
    return this._http.post( '/bus-types', data );
  }

  /**
   * @description Actualiza el tipo de bus
   * @param id Id de tipo de bus
   * @param data data de Tipo de bus
   * @returns Tipo de bus actualizado
   */
  updateType( id: number, data: any ): Observable<any> {
    return this._http.put( `/bus-types/${id}`, data );
  }

  /**
   * @description Eliminación de tipo de bus de la db
   * @param id Id del tipo de bus a eliminar
   * @returns Confirmación de proceso
   */
  deleteType( id: number ): Observable<any> {
    return this._http.delete( `/bus-types/${id}` );
  }

  private toastMessage( message: string ): void {
    const color = 'primary';
    this._common.presentToast( { message, color } );
  }

}
