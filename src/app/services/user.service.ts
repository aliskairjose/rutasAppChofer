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
    private common: CommonService,
    private httpService: HttpService
  ) { }


  /**
   * @description Mustra la lista de usuario
   * @returns Lista de usuarios
   */
  list(): Observable<User[]> {
    return this.httpService.get( '/users' ).pipe( map( response => response.data ) );
  }

  /**
   * @description Registra un nuevo usuario
   * @param usuario Datos del usuario
   * @returns usuario registrado
   */
  add( usuario: User ): Observable<any> {
    return this.httpService.post( '/users', usuario );
  }

  /**
   * @description Actualización del usuario
   * @param id Id del usuario a actualizar
   * @param client Data que se actualizará del usuario
   * @returns usuario Actualizado
   */
  update( id: number, client: any ): Observable<any> {
    return this.httpService.put( `/users/${id}`, client );
  }

  /**
   * @description Eliminación de usuario de la DB
   * @param id Id del usuario a eliminar
   * @returns Notificación
   */
  delete( id: number ): Observable<any> {
    return this.httpService.delete( `/users/${id}` ).pipe(
      map( response => {
        this.toastMessage( response.message );
      } )
    );
  }

  /**
   * @description Actualiza la foto de perfil
   * @param data Foto en base64
   * @returns Foto nueva
   */
  updateAvatar( data: any ): Observable<any> {
    return this.httpService.post( `/update-avatar`, data );
  }

  comment( comment: string ): Observable<any> {
    const data = {
      type_comment_id: 4,
      comment
    };
    return this.httpService.post( '/comments', data );
  }

  /**
   * @param id id del chofer
   */
  experience( id: number ): Observable<any[]> {
    return this.httpService
      .get( `/route-boarding-experiences?page=1&includes[]=routeBoarding.route.bus&driver_id=${id}` )
      .pipe( map( result => result.data ) );
  }

  private toastMessage( message: string ): void {
    this.common.presentToast( { message } );
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
