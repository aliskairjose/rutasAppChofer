import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Route } from '../../interfaces/route';
import { CommonService } from '../../services/common.service';
import { RouteService } from '../../services/route.service';
import { StorageService } from '../../services/storage.service';

@Component( {
  selector: 'app-assign-seat',
  templateUrl: './assign-seat.component.html',
  styleUrls: [ './assign-seat.component.scss' ],
} )
export class AssignSeatComponent implements OnInit {

  registeredSeat = false;
  route: Route = {};
  leftSeats = 0;
  rigthSeats = 0;
  backSeats = 0;
  totalSeats = 0;

  @Input() selectedRoute: Route = {};
  @Output() registerSeat: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() endRoute: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private common: CommonService,
    private storage: StorageService,
    private routeService: RouteService
  ) { }

  ngOnInit() { }

  // Asignación de puesto en el bus
  async assignSeat() {
    const loading = await this.common.presentLoading();
    loading.present();
    this.routeService.assignSeat( this.selectedRoute.id ).subscribe( response => {
      loading.dismiss();
      this.common.presentToast( { message: response.message } );
      this.registeredSeat = true;
      this.loadRoutes();
    } );
  }

  async endTravel() {
    const confirm = await this.common.alert();
    if ( confirm ) {
      const loading = await this.common.presentLoading();
      loading.present();
      this.routeService.end().subscribe( result => {
        const message = result.message;
        loading.dismiss();
        this.common.presentToast( { message } );
        this.endRoute.emit( true );
      } );
    }
  }

  async loadRoutes() {
    const user: any = await this.storage.getUser();
    const loading = await this.common.presentLoading();
    loading.present();
    this.routeService.list( user.id ).subscribe( ( routes: Route[] ) => {
      loading.dismiss();
      this.route = routes.find( item => item.id === this.selectedRoute.id );
    } );
  }
}
