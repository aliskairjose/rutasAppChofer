import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { HttpService } from './http.service';
import { User } from '../interfaces/user';
import { map } from 'rxjs/operators';
import { CommonService } from './common.service';

@Injectable( {
  providedIn: 'root'
} )

export class UserService {

  rutasData: any;
  rutasFlow = 0;
  rutasBarEdit = false;
  $flow: Subject<any> = new Subject<any>();

  constructor(
    private platform: Platform,
    private _common: CommonService,
    private _httpService: HttpService
  ) { }


  /**
   * @description Mustra la lista de usuario
   * @returns Lista de usuarios
   */
  list(): Observable<User[]> {
    return this._httpService.get( '/users' ).pipe( map( response => response.data ) );
  }

  /**
   * @description Registra un nuevo usuario
   * @param usuario Datos del usuario
   * @returns usuario registrado
   */
  add( usuario: User ): Observable<any> {
    return this._httpService.post( '/users', usuario );
  }

  /**
   * @description Actualización del usuario
   * @param id Id del usuario a actualizar
   * @param client Data que se actualizará del usuario
   * @returns usuario Actualizado
   */
  update( id: number, client: any ): Observable<any> {
    return this._httpService.put( `/users/${id}`, client );
  }

  /**
   * @description Eliminación de usuario de la DB
   * @param id Id del usuario a eliminar
   * @returns Notificación
   */
  delete( id: number ): Observable<any> {
    return this._httpService.delete( `/users/${id}` ).pipe(
      map( response => {
        this.toastMessage( response.message );
      } )
    );
  }

  comment( comment: string ): Observable<any> {
    const data = {
      type_comment_id: 4,
      comment
    };
    return this._httpService.post( '/comments', data );
  }

  private toastMessage( message: string ): void {
    const color = 'primary';
    this._common.presentToast( { message, color } );
  }

  subscribeBackHandler() {
    this.platform.backButton.subscribe();
  }

  unsubscribeBackHandler() {
    this.platform.backButton.unsubscribe();
  }

  /**
   * @description Genera el stream de eventos usando next() para crear el evento
   */
  flowSubject( flow: number ): void {
    this.$flow.next( flow );
    // this.$flow.complete();
  }

  /**
   * @description Creación del observer mediante el método asObserver(), el cual sera consumido por el componente
   * @returns Observable
   */
  flowhObserver(): Observable<number> {
    return this.$flow.asObservable();
  }
}
