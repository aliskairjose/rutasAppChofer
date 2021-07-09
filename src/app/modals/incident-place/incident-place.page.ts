import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController, LoadingController } from '@ionic/angular';
import { CommonService } from '../../services/common.service';
declare var google: any;


@Component( {
  selector: 'app-incident-place',
  templateUrl: './incident-place.page.html',
  styleUrls: [ './incident-place.page.scss' ],
} )
export class IncidentPlacePage implements OnInit {

  map: google.maps.Map;
  address: string;
  lat: string;
  long: string;
  autocomplete: { input: string; };
  autocompleteItems: any[] = [];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  coords: any;
  zoom = 18;

  @ViewChild( 'map', { static: false } ) mapElement: ElementRef;

  constructor(
    private geolocation: Geolocation,
    private common: CommonService,
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone,
    private modalController: ModalController,

  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  async ngOnInit() {
    const message = 'Obteniendo ubicación';
    const loading = await this.common.presentLoading( message );
    loading.present();
    const resp = await this.geolocation.getCurrentPosition();
    this.coords = resp.coords;
    loading.dismiss();
  }

  // AUTOCOMPLETE, SIMPLEMENTE ACTUALIZAMOS LA LISTA CON CADA EVENTO DE ION CHANGE EN LA VISTA.
  updateSearchResults() {
    if ( this.autocomplete.input === '' ) {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions( { input: this.autocomplete.input },
      ( predictions, status ) => {
        this.autocompleteItems = [];
        this.zone.run( () => {
          predictions.forEach( ( prediction ) => {
            this.autocompleteItems.push( prediction );
          } );
        } );
      } );
  }

  // LLAMAMOS A ESTA FUNCION PARA LIMPIAR LA LISTA CUANDO PULSAMOS IONCLEAR.
  clearAutocomplete() {
    this.autocompleteItems = [];
    this.autocomplete.input = '';
  }

  clickLocationEvent( event ): void {
    this.getLocationInfo( event.coords.lat, event.coords.lng );
  }

  // FUNCION QUE LLAMAMOS DESDE EL ITEM DE LA LISTA.
  async selectSearchResult( item ) {
    console.log( item );
    const coord = {
      place: item.description,
      lattitude: this.lat,
      longitude: this.long
    };
    await this.modalController.dismiss( coord );

  }

  private async getLocationInfo( lattitude, longitude ) {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 1
    };

    const result: NativeGeocoderResult[] = await this.nativeGeocoder.reverseGeocode( lattitude, longitude, options );

    const detail = result[ 0 ];
    const coord = {
      place: detail.thoroughfare,
      lattitude,
      longitude
    };
    await this.modalController.dismiss( coord );

  }

}
