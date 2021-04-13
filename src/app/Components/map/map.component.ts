import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';
import {UserService} from '../../services/user.service';

const { Geolocation } = Plugins;

declare var google;
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];
  locations: Observable<any>;
  currLat = 20.7766443;
  currLng = 12.3288527;
  watch = null;

  constructor(
    public userService: UserService
  ) {

  }

  ionViewWillEnter() {
    this.loadMap();
  }

  ionViewDidLoad() {

  }

  loadMap() {
    this.watch = Geolocation.watchPosition({}, (position, err) => {
      console.log('position', position );
      if (position) {
        this.currLat = position.coords.latitude;
        this.currLng = position.coords.longitude;
      }
      const latLng = new google.maps.LatLng(this.currLat, this.currLng);
      const mapOptions = {
        center: latLng,
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      console.log('latLng', latLng);
      this.updateMap([latLng]);
    });
  }

  updateMap(locations) {
    this.markers.map(marker => marker.setMap(null));
    this.markers = [];
    for (const loc of locations) {
      const marker = new google.maps.Marker({
        position: loc,
        animation: google.maps.Animation.DROP,
        map: this.map
      });
      this.markers.push(marker);
    }
  }

  ngOnInit() {
    let dismissElement: any;
    setInterval(() => {
      dismissElement = document.getElementsByClassName('dismissButton')[0];
      if (dismissElement) {
        dismissElement.click();
        clearInterval();
      }
    }, 100);
  }

}
