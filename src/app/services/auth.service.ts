import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, Subject } from 'rxjs';
import { StorageService } from './storage.service';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { map } from 'rxjs/operators';
import { CommonService } from './common.service';
import { TOKEN } from '../constants/global-constants';

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {
  $auth: Subject<any> = new Subject<any>();

  constructor(
    private _common: CommonService,
    private _storage: StorageService,
    private _httpService: HttpService,
  ) { }

  /**
   * @description Inicio de sesión a la app
   * @param data Objeto { email, password }
   */
  login( data: any ): Observable<any> {
    return this._httpService.post( '/login/user', data );
  }

  register( data: any ): Observable<any> {
    return this._httpService.post( '/users', data ).pipe(
      map( response => {
        this.toastMessage( response.message );
        return response;
      } )
    );
  }

  recoverPassword( data ): Observable<any> {
    return this._httpService.post( '/reset-password', data ).pipe(
      map( ( response ) => {
        const message = response.message;
        this.toastMessage( response.message );
      } )
    );
  }

  isLoggedIn(): boolean {
    return this._storage.get( TOKEN ) ? true : false;
  }

  /**
   * @description Válida si el correo ya existe en el sistema
   * @param email Email del usuario a consultar
   * @returns True o False
   */
  exist( email: string ): Promise<boolean> {
    return new Promise<boolean>( resolve => {
      this._httpService.get( `/verify-email/${email}` ).subscribe( res => resolve( res ) );
    } );
  }

  private toastMessage( message: string ): void {
    const color = 'primary';
    this._common.presentToast( { message, color } );
  }

  /**
   * @description Genera el stream de eventos usando next() para crear el evento
   */
  AuthSubject( user: User ): void {
    this.$auth.next( user );
    this.$auth.complete();
  }

  /**
   * @description Creación del observer mediante el método asObserver(), el cual sera consumido por el componente
   * @returns Observable
   */
  authObserver(): Observable<User> {
    return this.$auth.asObservable();
  }


}
