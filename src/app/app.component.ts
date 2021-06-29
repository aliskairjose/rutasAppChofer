import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import {
  BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation/ngx';
import { Platform } from '@ionic/angular';

import { TOKEN, ACTIVE_ROUTE } from './constants/global-constants';
import { StorageService } from './services/storage.service';
import { RouteService } from './services/route.service';
import { Route } from './interfaces/route';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';

const { SplashScreen } = Plugins;
declare var window;
@Component( {
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [ 'app.component.scss' ],
} )
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private platform: Platform,
    private storage: StorageService,
    private routeService: RouteService,
    private backgroundMode: BackgroundMode,
    private foregroundService: ForegroundService,
    private backgroundGeolocation: BackgroundGeolocation,
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
  }

  initializeApp(): void {
    this.platform.ready().then( async () => {
      SplashScreen.hide();
      const isLoggedin = await this.storage.get( TOKEN );
      const route = isLoggedin ? '/sidemenu/inicio' : '/initial';
      this.router.navigate( [ route ] );

      this.backgroundMode.enable();
      this.backgroundMode.on( 'activate' ).subscribe( () => {

      } );

      const options: BackgroundGeolocationConfig = {
        desiredAccuracy: 10,
        stationaryRadius: 10,
        distanceFilter: 10,
        interval: 6000,
        fastestInterval: 12000,
        stopOnTerminate: false,
        startForeground: true,
        startOnBoot: true,
        notificationTitle: 'Rutas Panamá Chofer',
        notificationText: 'Aplicación en segundo plano',
      };

      this.backgroundGeolocation.configure( options ).then( async () => {
        const activeRoute: Route = await ( this.storage.get( ACTIVE_ROUTE ) ) as Route;

        this.backgroundGeolocation
          .on( BackgroundGeolocationEvents.background )
          .subscribe( ( location: BackgroundGeolocationResponse ) => {
            console.log( '[INFO] App is in background', location );
          } );
        this.backgroundGeolocation
          .on( BackgroundGeolocationEvents.foreground )
          .subscribe( ( location: BackgroundGeolocationResponse ) => {
            console.log( '[INFO] App is in foreground', location );
          } );

        this.backgroundGeolocation
          .on( BackgroundGeolocationEvents.location )
          .subscribe( async ( location: BackgroundGeolocationResponse ) => {
            const data = {
              route_id: activeRoute.id,
              longitude: location.longitude,
              latitude: location.latitude,
            };
            this.routeService.routePosition( data ).subscribe( ( response ) => {
              const pos = { lattitude: location.latitude, longitude: location.longitude };
              this.routeService.positionSubject( pos );
            } );
          } );
      } );

      window.app = this;
    } );
  }

}
