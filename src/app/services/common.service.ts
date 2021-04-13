import { Injectable } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';

@Injectable( {
  providedIn: 'root'
} )
export class CommonService {

  constructor(
    private loading: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController,
  ) { }

  async presentLoading() {
    const loading = await this.loading.create( {
      message: 'Por favor espere...',
      duration: 2000
    } );
    return loading;
  }

  /**
   * 
   * @param component Componente que se mostrará en el modal
   * @param cssClass Clase personalizada
   * @returns Instancia del Modal
   */
  async presentModal( { component, cssClass, componentProps }: { component: any; cssClass?: string; componentProps?: any } ) {
    const modal = await this.modalController.create( { component, cssClass, componentProps } );
    return modal;
  }

  /**
   *
   * @param message Mensaje a mostrar
   * @param color primary | secondary | tertiary | success | warning | danger | light | medium | dark Por defecto success
   * @param duration Tiempo en milisegundos, por defecto 2000
   */
  // tslint:disable-next-line: max-line-length
  async presentToast( { message, color = 'success', duration = 2000 }: { message: string; color?: string; duration?: number; } ) {

    const toast = await this.toastController.create( {
      message,
      duration,
      position: 'bottom',
      color
    } );
    toast.present();
  }

}
