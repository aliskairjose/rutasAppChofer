import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { User } from '../../interfaces/user';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { LOGO, USER, MENU } from '../../constants/global-constants';
import { UserService } from '../../services/user.service';

import { Plugins, CameraResultType, CameraDirection } from '@capacitor/core';
import { CommonService } from '../../services/common.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

const { Camera } = Plugins;

@Component( {
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.page.html',
  styleUrls: [ './sidemenu.page.scss' ],
} )
export class SidemenuPage implements OnInit, OnChanges {

  backdropVisible = false;
  drawerVar = 'Inicio';
  addressClicked = 0;
  user: User = {};
  abrv = '';
  logo = LOGO;
  avatar = 'avatar_default.jpg';
  private _activeRoute = 0;

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
    private common: CommonService,
    private userService: UserService,
    private storage: StorageService,
    private googlePlus: GooglePlus,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.user = {};
    this._auth.authObserver().subscribe( ( user: any ) => this.user = { ...user } );
  }

  ngOnChanges( changes: SimpleChanges ): void {
  }

  ngOnInit() {
    this.storage.get( USER ).then( ( user: any ) => this.user = { ...user } );
  }

  toggleBackdrop( isVisible ) {
    this.backdropVisible = isVisible;
    this.changeDetectorRef.detectChanges();
  }

  async logout() {
    const googleLogin = await this.storage.get( 'dgoogleLogin' );
    if ( googleLogin ) {
      this.googlePlus.disconnect().then( async () => {
        await this.storage.clear()
        this.router.navigate( [ '/signin' ] );
      } );
      return;
    }
    await this.storage.clear();
    this.router.navigate( [ '/signin' ] );
  }

  menuOptionClickHandle( p, i ) {
    this.userService.flowSubject( p.route );
    this._activeRoute = i;
    this.drawerVar = p.title;
    this.router.navigate( [ p.url ] );
  }


  set activeRoute( i: number ) {
    this._activeRoute = i;
  }

  get activeRoute(): number {
    return this._activeRoute;
  }

}
