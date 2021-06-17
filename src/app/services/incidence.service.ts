import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { IncidenceResponse, IncidenceData } from '../interfaces/incidence';
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
  list( data: IncidenceData ): Observable<IncidenceResponse> {
    return this.http.get( `/incidents`, data );
  }

}
