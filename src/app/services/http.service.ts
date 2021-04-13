import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable( {
  providedIn: 'root'
} )
export class HttpService {

  constructor(
    private _http: HttpClient
  ) { }

  post( serviceName: string, data: any ): Observable<any> {
    const url = environment.api + serviceName;
    return this._http.post( url, data );
  }

  get( serviceName: string ): Observable<any> {
    const url = environment.api + serviceName;
    return this._http.get( url );
  }

  put( serviceName: string, data: any ): Observable<any> {
    const url = environment.api + serviceName;
    return this._http.put( url, data );
  }

  patch( serviceName: string, data: any ): Observable<any> {
    const url = environment.api + serviceName;
    return this._http.patch( url, data );
  }

  delete( serviceName: string, data?: any ): Observable<any> {
    const url = environment.api + serviceName;
    return this._http.delete( url, data );
  }
}
