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
  list( params: IncidenceData ): Observable<IncidenceResponse<Incidence[]>> {
    return this.http.get( `/incidents?includes[]=typeIncident&includes[]=driver&includes[]=route&includes[]=solution`, params );
  }

  getById( id: string ): Observable<IncidenceResponse<Incidence>> {
    return this.http.get( `/incidents/${id}?includes[]=typeIncident&includes[]=driver&includes[]=route` );
  }

  /**
   * @description Agrega una nueva incidencia
   * @param data Detalles de la incidencia
   * @returns Incidencia
   */
  add( data: Incidence ): Observable<IncidenceResponse<any>> {
    return this.http.post( `/incidents`, data );
  }

  types(): Observable<IncidenceResponse<IncidenceType[]>> {
    return this.http.get( `/type-incidents` );
  }

}
