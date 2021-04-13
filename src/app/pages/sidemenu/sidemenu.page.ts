import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { User } from '../../interfaces/user';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { LOGO, USER, MENU } from '../../constants/global-constants';
import { UserService } from '../../services/user.service';


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

  appPages = [
    { title: 'Mi Perfil', url: 'profile', icon: MENU.PROFILE, route: 100 },
    { title: 'Inicio', url: '/sidemenu/inicio', icon: MENU.HOME, route: 0 },
    { title: 'Rutas', url: '/sidemenu/inicio', icon: MENU.ROUTES, route: 1 },
    { title: 'Incidencias', url: 'incidences', icon: MENU.INCIDENCES, route: 2 },
    { title: 'Calificaciones', url: 'qualification', icon: MENU.RATINGS, route: 3 },
  ];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private userService: UserService,
    private _storage: StorageService,
    private _auth: AuthService,
    private router: Router,
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

}
