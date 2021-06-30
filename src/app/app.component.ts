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
      const route = isLoggedin ? '/sidemenu/inicio' : '/initial';
      this.router.navigate( [ route ] );
      const options: BackgroundGeolocationConfig = {
        desiredAccuracy: 10,
        stationaryRadius: 10,
        distanceFilter: 10,
        interval: 6000,
        fastestInterval: 12000,
        stopOnTerminate: true,
        notificationTitle: 'Rutas Panamá Chofer',
        notificationText: 'Aplicación en segundo plano',
      };

      this.backgroundGeolocation.configure( options );

      this.foregroundService.start( 'Rutas Panama', 'Tracking' );

      this.backgroundMode.enable();
      this.backgroundMode.on( 'activate' ).subscribe( () => {
        // this.backgroundMode.disableBatteryOptimizations();
        // this.backgroundMode.disableWebViewOptimizations();
        console.log( '[INFO] App is in backgroundMode.on' );
        this.backGroudPositions();
        setInterval( () => console.log( 'en espera' ), 3000 );
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

      window.app = this;
    } );
  }

  async backGroudPositions() {
    const activeRoute: Route = await ( this.storage.get( ACTIVE_ROUTE ) ) as Route;
    BackgroundLocation.initialize( {
      notificationText: 'enviando ubicación.',
      notificationTitle: 'Gestionar en ejecución',
      updateInterval: 5000,
      requestedAccuracy: BgGeolocationAccuracy.HIGH_ACCURACY,
      smallIcon: 'ic_small_icon',
      startImmediately: true,
    } );
    BackgroundLocation.start();
    BackgroundLocation.addListener( 'onLocation', ( location: BgLocationEvent ) => {
      console.log( location );
      if ( activeRoute ) {
        const data = {
          route_id: activeRoute.id,
          longitude: location.longitude,
          latitude: location.latitude,
        };
        this.setPosition( data );
        // setInterval( () => this.setPosition( data ), 5000 );
      }
    } );
  }

  private setPosition( data ): void {
    console.log( data );
    this.routeService.routePosition( data ).subscribe( () => {
      const pos = { lattitude: data.latitude, longitude: data.longitude };
      this.routeService.positionSubject( pos );
    } );
  }

}
