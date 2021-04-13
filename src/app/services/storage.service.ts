import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { User } from '../interfaces/user';
import { USER } from '../constants/global-constants';
const { Storage } = Plugins;

@Injectable( {
  providedIn: 'root'
} )

export class StorageService {
  constructor() { }

  /**
   * @description Almacena la data en el localStorage
   * @param key Identificador del valor a almacenar
   * @param value Valor a almacenar
   */
  async store( key: string, value: any ) {
    await Storage.set( {
      key, value: JSON.stringify( value )
    } );
  }

  /**
   * @description Recupera la data almacenada en el localStorage
   * @param key Identificador del dato que se desea recuperar
   * @returns value { any }
   */
  async get( key: string ): Promise<{ value: any }> {
    const item = await Storage.get( { key } );
    return JSON.parse( item.value );
  }

  /**
   * @description Recupera el usuario almacenado en el localStorage
   * @returns Usuario
   */
  async getUser(): Promise<{ value: User }> {
    const item = await Storage.get( { key: USER } );
    return JSON.parse( item.value );
  }

  /**
   * @description Elimina la data almacenada según el identificador
   * @param key Identificador de la data que se desea eliminar
   */
  async removeStorageItem( key: string ) {
    await Storage.remove( { key } );
  }

  /**
   * @description Elimina toda la data almacenada en el localStorage
   */
  async clear() {
    await Storage.clear();
  }
}