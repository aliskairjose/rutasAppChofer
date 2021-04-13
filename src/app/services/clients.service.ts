import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client } from '../interfaces/client';

@Injectable( {
  providedIn: 'root'
} )
export class ClientsService {

  constructor(
    private _httpService: HttpService
  ) { }

  /**
   * @description Consulta la lista de clientes
   * @returns Listado de clientes
   */
  list(): Observable<any> {
    return this._httpService.get( '/clients' );
  }

  /**
   * @description Registra un nuevo cliente
   * @param cliente Datos del cliente
   * @returns Cliente registrado
   */
  add( cliente: Client ): Observable<Client> {
    return this._httpService.post( '/clients', cliente ).pipe( map( response => response.data ) );
  }

  /**
   * @description Actualización del cliente
   * @param id Id del cliente a actualizar
   * @param client Data que se actualizará del cliente
   * @returns Cliente Actualizado
   */
  update( id: number, client: any ): Observable<any> {
    return this._httpService.put( `/clients/${id}`, client );
  }

  /**
   * @description Eliminación de cliente de la DB
   * @param id Id del cliente a eliminar
   * @returns Notificación
   */
  delete( id: number ): Observable<any> {
    return this._httpService.delete( `/clients/${id}` );
  }

}
