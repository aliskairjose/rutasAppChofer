import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { User } from '../../interfaces/user';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { LOGO, USER, MENU } from '../../constants/global-constants';
import { UserService } from '../../services/user.service';

import { Plugins, CameraResultType, CameraDirection } from '@capacitor/core';
import { CommonService } from '../../services/common.service';

const { Camera } = Plugins;

@Component( {
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.page.html',
  styleUrls: [ './sidemenu.page.scss' ],
} )
export class SidemenuPage implements OnInit, OnChanges {

  backdropVisible = false;
  drawerVar = 'Inicio';
  activeRoute = 0;
  addressClicked = 0;
  user: User = {};
  abrv = '';
  logo = LOGO;
  avatar = 'avatar_default.jpg';

  appPages = [
    { title: 'Mi Perfil', url: 'profile', icon: MENU.PROFILE, route: 100 },
    { title: 'Inicio', url: '/sidemenu/inicio', icon: MENU.HOME, route: 0 },
    { title: 'Rutas', url: '/sidemenu/inicio', icon: MENU.ROUTES, route: 1 },
    { title: 'Incidencias', url: 'incidences', icon: MENU.INCIDENCES, route: 2 },
    { title: 'Calificaciones', url: '/sidemenu/qualification', icon: MENU.RATINGS, route: 3 },
  ];

  constructor(
    private router: Router,
    private _auth: AuthService,
    private _common: CommonService,
    private userService: UserService,
    private _storage: StorageService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.user = {};
    this._auth.authObserver().subscribe( ( user: any ) => {
      this.user = { ...user };
      const value = this.user.name.split( ' ' );
      this.abrv = `${value[ 0 ].charAt( 0 )}${value[ 1 ].charAt( 0 )}`;
    } );
  }

  ngOnChanges( changes: SimpleChanges ): void {
  }

  ngOnInit() {
    this._storage.get( USER ).then( ( user: any ) => {
      this.user = { ...user };
      const value = this.user.name.split( ' ' );
      this.abrv = `${value[ 0 ].charAt( 0 )}${value[ 1 ].charAt( 0 )}`;
    } );
  }

  toggleBackdrop( isVisible ) {
    this.backdropVisible = isVisible;
    this.changeDetectorRef.detectChanges();
  }

  logout() {
    localStorage.clear();
    this.router.navigate( [ '/signin' ] );
  }

  menuOptionClickHandle( p, i ) {
    this.userService.flowSubject( p.route );
    this.activeRoute = i;
    this.drawerVar = p.title;
    this.router.navigate( [ p.url ] );
  }

  async takePicture() {
    const image = await Camera.getPhoto( {
      quality: 30,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      direction: CameraDirection.Front // iOS and Web only
    } );

    const fileExt = this.user.avatar.includes( 'jpg' ) ? 'png' : 'jpg';

    const imageUrl = `data:image/${fileExt};base64,${image.base64String}`;
    const loading = await this._common.presentLoading();
    loading.present();
    this.userService.updateAvatar( { avatar: imageUrl } ).subscribe( async ( result ) => {
      loading.dismiss();
      await this._storage.store( USER, result.data );
      this._auth.AuthSubject( result.data );
      this.user = { ...result.data };
      const message = result.message;
      const color = 'primary';
      this._common.presentToast( { message, color } );
    }, () => loading.dismiss() );
  }


}
