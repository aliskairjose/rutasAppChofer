import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';
import {
  BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation/ngx';
import { Platform } from '@ionic/angular';

import { TOKEN, ACTIVE_ROUTE } from './constants/global-constants';
import { StorageService } from './services/storage.service';
import { RouteService } from './services/route.service';
import { Route } from './interfaces/route';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';

const { BackgroundGeolocation: BackgroundLocation } = Plugins;

import {
  BgLocationEvent,
  BgGeolocationAccuracy,
} from 'capacitor-background-geolocation';

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
    private geolocation: Geolocation,
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
      const route = isLoggedin ? '/sidemenu/inicio' : '/signin';
      this.router.navigate( [ route ] );

      BackgroundLocation.initialize( {
        notificationText: 'enviando ubicación.',
        notificationTitle: 'Rutas en ejecución',
        updateInterval: 480000,
        requestedAccuracy: BgGeolocationAccuracy.HIGH_ACCURACY,
        smallIcon: 'ic_small_icon',
        startImmediately: true,
      } );

      const options: BackgroundGeolocationConfig = {
        startForeground: true,
        desiredAccuracy: 10,
        stationaryRadius: 10,
        distanceFilter: 10,
        interval: 60000,
        fastestInterval: 120000,
        stopOnTerminate: true,
        notificationTitle: 'Rutas Panamá Chofer',
        notificationText: 'Aplicación en segundo plano',
      };

      this.backgroundGeolocation.configure( options );

      this.backgroundMode.enable();

      this.backgroundGeolocation
        .on( BackgroundGeolocationEvents.background )
        .subscribe( () => {
          this.foregroundService.start( 'Rutas Panamá Chofer', 'Background Service', 'drawable/fsicon' );
          BackgroundLocation.start();
          this.backgroundGeolocation.stop();
        } );

      this.backgroundGeolocation
        .on( BackgroundGeolocationEvents.foreground ).subscribe( () => {
          BackgroundLocation.stop();
          this.foregroundService.stop();
          this.backgroundGeolocation.start();
        } );

      this.backgroundGeolocation
        .on( BackgroundGeolocationEvents.location )
        .subscribe( async ( location: BackgroundGeolocationResponse ) => {
          const activeRoute: Route = await ( this.storage.get( ACTIVE_ROUTE ) ) as Route;
          if ( activeRoute ) {
            const data = {
              route_id: activeRoute.id,
              longitude: location.longitude,
              latitude: location.latitude,
            };
            this.setPosition( data );
          }
        } );

      BackgroundLocation.addListener( 'onLocation', async ( location: BgLocationEvent ) => {
        const activeRoute: Route = await ( this.storage.get( ACTIVE_ROUTE ) ) as Route;
        if ( activeRoute ) {
          const data = {
            route_id: activeRoute.id,
            longitude: location.longitude,
            latitude: location.latitude,
          };
          this.setPosition( data );
        }
      } );

      window.app = this;
    } );
  }


  private setPosition( data ): void {
    this.routeService.routePosition( data ).subscribe( () => {
      const pos = { lattitude: data.latitude, longitude: data.longitude };
      this.routeService.positionSubject( pos );
    } );
  }

}
