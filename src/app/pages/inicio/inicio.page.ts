import { UserService } from 'src/app/services/user.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Route, RouteStop } from '../../interfaces/route';
import { MAP } from '../../constants/global-constants';
import { CommonService } from '../../services/common.service';
declare var google: any;

@Component( {
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: [ './inicio.page.scss' ],
} )
export class InicioPage implements OnInit {

  map: google.maps.Map;
  markers: google.maps.Marker[] = [];
  userMarker: google.maps.Marker[] = [];
  watch = null;
  selectedItem: Route;
  watchId = null;
  trackMarker = null;

  @ViewChild( 'map' ) mapElement: ElementRef;

  constructor(
    private _common: CommonService,
    public userService: UserService,
    private geolocation: Geolocation,
  ) {
    this.userService
      .flowhObserver()
      .subscribe( flow => { if ( [ 0, 2, 3 ].includes( flow ) ) { this.ngOnInit(); } } );
  }

  ngOnInit() {
    this.clearMapError();
    this.loadMap();
  }

  bottomDrawerEvent( event: any ) {
    if ( event.type === 'item-selected' ) {
      this.handleItemSelect( event.data );
      return;
    }
    if ( event.type === 'scan-success' ) {
      this.startTracking();
      return;
    }
    if ( event.type === 'stop-track' ) {
      this.stopTracking();
      return;
    }
  }

  clearMapError() {
    let dismissElement: any;
    setInterval( () => {
      dismissElement = document.getElementsByClassName( 'dismissButton' )[ 0 ];
      if ( dismissElement ) {
        dismissElement.click();
        clearInterval();
      }
    }, 100 );
  }

  async loadMap() {
    const resp = await this.geolocation.getCurrentPosition();
    const data = { coord: new google.maps.LatLng( resp.coords.latitude, resp.coords.longitude ), name: 'Aquí estoy' };
    const mapOptions = {
      center: data.coord,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.map
    };
    const map: google.maps.Map = new google.maps.Map( this.mapElement.nativeElement, mapOptions );

    this.updateMap( [ data ], '', map );
  }

  async handleItemSelect( route: Route ) {

    const resp = await this.geolocation.getCurrentPosition();
    const data = { coord: new google.maps.LatLng( resp.coords.latitude, resp.coords.longitude ), name: 'Aquí estoy' };
    const mapOptions = {
      center: data.coord,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.map
    };
    const map: google.maps.Map = new google.maps.Map( this.mapElement.nativeElement, mapOptions );

    // actualizamos el mapa y limpiamos la rutas previas
    await this.updateMap( [ data ], '', map );

    this.selectedItem = { ...route };
    const stops: RouteStop[] = [ ...this.selectedItem.route_stops ];
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer( { map, suppressMarkers: true } );
    const loading = await this._common.presentLoading();
    loading.present();

    await this.calculateAndDisplayRoute( stops, directionsRenderer, directionsService, map );
    loading.dismiss();
  }

  private async calculateAndDisplayRoute(
    locations: RouteStop[],
    directionsRenderer: google.maps.DirectionsRenderer,
    directionsService: google.maps.DirectionsService,
    map: google.maps.Map
  ): Promise<boolean> {

    return new Promise<boolean>( resolve => {

      this.markers.map( _marker => _marker.setMap( null ) ); // se pasa this.map para mantener el marcador del usuario
      this.markers = [];
      const travelMode = google.maps.TravelMode.DRIVING;
      const waypoints: google.maps.DirectionsWaypoint[] = [];

      const origin = new google.maps.LatLng(
        locations[ 0 ].lattitude,
        locations[ 0 ].longitude
      );

      const destination = new google.maps.LatLng(
        locations[ locations.length - 1 ].lattitude,
        locations[ locations.length - 1 ].longitude
      );

      if ( locations.length > 2 ) {
        const locs = [ ...locations ];
        locs.shift();
        locs.pop();
        locs.forEach( loc => {
          waypoints.push( {
            location: new google.maps.LatLng( loc.lattitude, loc.longitude ),
            stopover: true
          } );
        } );
      }

      const request = {
        origin,
        destination,
        waypoints,
        optimizeWaypoints: true,
        travelMode
      };

      directionsService.route( request, (
        result: google.maps.DirectionsResult | null,
        status: google.maps.DirectionsStatus
      ) => {
        if ( status === 'OK' && result ) {

          directionsRenderer.setDirections( result );
          const route = result.routes[ 0 ];

          // InfoWindow se instancia antes del marcador para que no se abra al cargar el mapa
          const iwStartMarker: google.maps.InfoWindow = new google.maps.InfoWindow( {
            content: locations[ 0 ].name
          } );

          // EL primer marcador
          const startMarker = new google.maps.Marker( {
            position: route.legs[ 0 ].start_location,
            animation: google.maps.Animation.DROP,
            map,
            icon: MAP.STOP_MARK
          } );
          startMarker.addListener( 'click', () => {
            iwStartMarker.close();
            iwStartMarker.open( this.map, startMarker );
          } );
          this.markers.push( startMarker );

          // Marcadores para las paradas
          for ( let i = 1; i < route.legs.length; i++ ) {
            const iwStepMarker: google.maps.InfoWindow = new google.maps.InfoWindow( {
              content: locations[ i ].name
            } );

            const stepMarker = new google.maps.Marker( {
              position: route.legs[ i ].start_location,
              animation: google.maps.Animation.DROP,
              map,
              icon: MAP.STOP_MARK
            } );

            stepMarker.addListener( 'click', () => {
              iwStepMarker.close();
              iwStepMarker.open( this.map, stepMarker );
            } );
            this.markers.push( stepMarker );
          }

          // El ultimo marcador
          const iwEndMarker: google.maps.InfoWindow = new google.maps.InfoWindow( {
            content: locations[ locations.length - 1 ].name
          } );
          const endMarker = new google.maps.Marker( {
            position: route.legs[ route.legs.length - 1 ].end_location,
            animation: google.maps.Animation.DROP,
            map,
            icon: MAP.END_ROUTE_MARK
          } );

          endMarker.addListener( 'click', () => {
            iwEndMarker.open( this.map, endMarker );
          } );
          this.markers.push( endMarker );
        }

      } );
      resolve( true );
    } );

  }

  startTracking() {
    this.watchId = navigator.geolocation.watchPosition( ( position ) => {

      const loc = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
      this.trackMarker?.setMap( null );
      this.trackMarker = new google.maps.Marker( {
        position: loc,
        map: this.map,
        icon: {
          scaledSize: new google.maps.Size( 25, 25 ),
          url: './../../../assets/bus.png'
        }
      } );
    } );
  }

  stopTracking() {
    navigator.geolocation.clearWatch( this.watchId );
    this.trackMarker.setMap( null );
  }

  private async updateMap(
    locations,
    extraInfo: string,
    map: google.maps.Map
  ): Promise<boolean> {
    return new Promise<boolean>( ( resolve ) => {
      this.markers.map( marker => marker.setMap( null ) ); // se pasa this.map para mantener el marcador del usuario
      this.markers = [];
      for ( const loc of locations ) {
        const marker = new google.maps.Marker( {
          position: loc.coord,
          animation: google.maps.Animation.DROP,
          map,
          icon: MAP.USER_MARK
        } );
        const iw = new google.maps.InfoWindow( {
          content: loc.name
        } );
        if ( extraInfo !== 'noTooltip' ) {
          iw.open( this.map, marker );
        }
        this.userMarker.push( marker );
      }
      resolve( true );
    } );

  }
}
