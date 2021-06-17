import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { IncidenceResponse, IncidenceData, IncidenceType, Incidence } from '../interfaces/incidence';
@Injectable( {
  providedIn: 'root'
} )
export class IncidenceService {

  constructor(
    private http: HttpService,
  ) { }

  /**
   * 
   * @returns Listado de incidencias
   */
  list( data: IncidenceData ): Observable<IncidenceResponse<Incidence[]>> {
    return this.http.get( `/incidents`, data );
  }

  /**
   * @description Agrega una nueva incidencia
   * @param data Detalles de la incidencia
   * @returns Incidencia
   */
  add( data: Incidence ): Observable<any> {
    return this.http.post( `/incidents` );
  }

  types(): Observable<IncidenceResponse<IncidenceType[]>> {
    return this.http.get( `/type-incidents` );
  }

}
