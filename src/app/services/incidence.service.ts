import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { IncidenceResponse } from '../interfaces/incidence';

@Injectable( {
  providedIn: 'root'
} )
export class IncidenceService {

  constructor(
    private http: HttpService
  ) { }

  list(): Observable<IncidenceResponse> {
    return this.http.get( `incidents` );
  }
}
