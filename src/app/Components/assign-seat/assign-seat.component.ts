import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Route } from '../../interfaces/route';
import { CommonService } from '../../services/common.service';
import { RouteService } from '../../services/route.service';
import { StorageService } from '../../services/storage.service';
import { ACTIVE_ROUTE } from '../../constants/global-constants';

@Component( {
  selector: 'app-assign-seat',
  templateUrl: './assign-seat.component.html',
  styleUrls: [ './assign-seat.component.scss' ],
} )
export class AssignSeatComponent implements OnInit {

  registeredSeat = false;
  route: Route = {};
  leftSeats = [];
  rightSeats = [];
  backSeats = 0;
  show = false;

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
    }, () => loading.dismiss() );
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
        this.storage.removeStorageItem( ACTIVE_ROUTE )
        this.endRoute.emit( true );
      } );
    }
  }

  async loadRoutes() {
    this.registeredSeat ||= !this.registeredSeat;
    const user: any = await this.storage.getUser();
    const loading = await this.common.presentLoading();
    loading.present();

    this.routeService.list( user.id ).subscribe( ( routes: Route[] ) => {
      loading.dismiss();
      this.route = routes.find( item => item.id === this.selectedRoute.id );
      this.show ||= !this.show;
      const totalSeats = this.selectedRoute.bus.number_positions;
      const occupiedSeat = this.route.occuped_seats - 2;
      const freeSeats = this.route.free_seats;
      const leftOccupiedSeats = [];
      const rightOccupiedSeats = [];
      const leftFreeSeats = [];
      const rightFreeSeats = [];

      // Distribuacion de asientos libre a la derecha e izquierda
      if ( freeSeats > 0 ) {
        const leftFreeSeat = Math.round( freeSeats / 2 );
        const rightFreeSeat = freeSeats - leftFreeSeat;
        leftFreeSeats.length = leftFreeSeat - 1;
        rightFreeSeats.length = rightFreeSeat - 1;
      }

      // Se inicializa los arrays. Se resta 1 sabiendo que el indice 0 es primero y quedaria un extra
      this.leftSeats.length = this.rightSeats.length = ( ( totalSeats - 2 ) / 2 );

      if ( occupiedSeat > 0 ) {
        // Distribución de asientos ocupados a la derecha e izquierda
        const leftOccupiedSeat = Math.round( occupiedSeat / 2 );
        const rightOccupiedSeat = occupiedSeat - leftOccupiedSeat;

        leftOccupiedSeats.length = leftOccupiedSeat;
        rightOccupiedSeats.length = rightOccupiedSeat;

        // Se muestran los asientos ocupados a la izquierda y derecha
        this.leftSeats.fill( { name: 'square', occupied: true, color: 'danger' }, 0, leftOccupiedSeat );
        this.leftSeats.fill( { name: 'square-outline', occupied: false }, leftOccupiedSeat, this.leftSeats.length );

        this.rightSeats.fill( { name: 'square', occupied: true, color: 'danger' }, 0, rightOccupiedSeat );
        this.rightSeats.fill( { name: 'square-outline', occupied: false }, rightOccupiedSeat, this.rightSeats.length );

        return;
      }

      this.rightSeats.fill( { name: 'square-outline', occupied: false } );
      this.leftSeats.fill( { name: 'square-outline', occupied: false } );

    } );
  }
}
