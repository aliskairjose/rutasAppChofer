
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { CommonService } from './common.service';
import { TOKEN } from '../constants/global-constants';

@Injectable( {
  providedIn: 'root'
} )
export class AuthInterceptorService implements HttpInterceptor {

  token = '';
  constructor(
    private router: Router,
    private commonService: CommonService,
    private _storage: StorageService,
  ) {

  }

  intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {

    return from( this._storage.get( TOKEN ) ).pipe(
      switchMap( token => {

        // Importante: modificamos de forma inmutable, haciendo el clonado de la petición
        const headers = this.addToken( request, `${token}` );

        // Pasamos al siguiente interceptor de la cadena la petición modificada
        return next.handle( headers ).pipe(
          catchError( result => {
            const message = result.error.message;
            const color = 'danger';
            this.commonService.presentToast( { message, color } );
            return throwError( result );
          } )
        );
      } )
    );
  }

  private addToken( request: HttpRequest<any>, token: any ) {
    if ( token ) {
      let clone: HttpRequest<any>;
      clone = request.clone( {
        setHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      } );
      return clone;
    }
  }

}
