import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { ERROR_FORM, LOGO, TOKEN, USER } from '../../constants/global-constants';
import { CommonService } from '../../services/common.service';
import { ClientsModalPage } from '../../modals/clients-modal/clients-modal.page';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { environment } from '../../../environments/environment.prod';

@Component( {
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: [ './authentication.page.scss' ],
} )
export class AuthenticationPage implements OnInit {

  loginForm: FormGroup;
  submitted: boolean;
  formError = ERROR_FORM;
  logo = LOGO;

  constructor(
    private router: Router,
    private _auth: AuthService,
    private common: CommonService,
    private formBuilder: FormBuilder,
    private storage: StorageService,
    private googlePlus: GooglePlus,

  ) {
    this.createForm();

  }

  ngOnInit() {
  }

  get f() { return this.loginForm.controls; }

  googleLogin() {
    this.googlePlus.login( environment.googleConfig ).then( async ( gplusUser ) => {
      if ( gplusUser.idToken ) {
        const loading = await this.common.presentLoading();
        loading.present();
        const result = await this._auth.exist( gplusUser.email );
        loading.dismiss();
        if ( result.exist ) {
          if ( result.user.roles[ 0 ].name !== 'driver' ) {
            const message = 'No puedes acceder con esta cuenta, ya que esta asociada a otro rol en el sistema.';
            const color = 'danger';
            this.common.presentToast( { message, color } );
            return;
          }
          this.googleAccess( { email: gplusUser.email, google_id: gplusUser.userId } );
        } else {
          this.registerGoogleUSer( gplusUser );
        }
      }
    }, ( err ) => { console.log( err ); } );

  }

  async onSubmit() {
    this.submitted = true;
    if ( this.loginForm.valid ) {
      const loading = await this.common.presentLoading();
      loading.present();
      this._auth.login( this.loginForm.value ).subscribe( async ( response ) => {
        this._auth.AuthSubject( response.user );
        await this.storage.store( TOKEN, response.data );
        await this.storage.store( USER, response.user );
        await this.storage.store( 'dgoogleLogin', false );
        this.submitted = false;
        this.loginForm.reset();
        loading.dismiss();
        this.router.navigate( [ '/sidemenu/inicio' ] );
      }, ( error ) => {
        loading.dismiss();
        console.log( error );

      } );
    }
  }

  /**
   * @description Registro del usuario google
   */
  private async registerGoogleUSer( googleUser ): Promise<void> {
    const modal = await this.common.presentModal( { component: ClientsModalPage, cssClass: '', componentProps: { user: googleUser } } );
    modal.present();
    const modalData = await modal.onDidDismiss();
    if ( modalData.role === 'submit' ) {
      this.googleAccess( modalData.data );
    }
  }

  /**
   * @description Registro / Acceso del usuario google
   */
  private async googleAccess( accessData: any ) {
    const loading = await this.common.presentLoading();
    loading.present();
    this._auth.login( accessData ).subscribe( async ( response ) => {
      loading.dismiss();
      this._auth.AuthSubject( response.user );
      const message = response.message;
      this.common.presentToast( { message } );
      await this.storage.store( TOKEN, response.data );
      await this.storage.store( USER, response.user );
      await this.storage.store( 'dgoogleLogin', true );
      this.router.navigate( [ '/sidemenu/Inicio' ] );
    } );
  }

  private createForm(): void {
    this.loginForm = this.formBuilder.group( {
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required, Validators.minLength( 8 ) ] ],
    } );
  }

}
