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
  leftSeats = [];
  rightSeats = [];
  backSeats = 0;

  private _totalSeats = 0;
  private _leftOccupiedSeats = 0;
  private _rightOccupiedSeats = 0;
  private _leftFreeSeats = 0;
  private _rightFreeSeats = 0;

  private _occupiedSeats = 0;
  private _freeSeats = 0;

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

      this._totalSeats = this.selectedRoute.bus.number_positions;
      this._occupiedSeats = this.route.occuped_seats;
      this._freeSeats = this.route.free_seats;

      // Distribuacion de asientos libre a la derecha e izquierda
      this._leftFreeSeats = Math.round( this._freeSeats / 2 );
      this._rightFreeSeats = this._freeSeats - this._leftFreeSeats;



      // Se inicializa los arrays. Se resta 1 sabiendo que el indice 0 es primero y quedaria un extra
      this.leftSeats.length = this.rightSeats.length = ( ( this._totalSeats - 6 ) / 2 ) - 1;

      if ( this._occupiedSeats > 0 ) {
        // Distribución de asientos ocupados a la derecha e izquierda
        this._leftOccupiedSeats = Math.round( this._occupiedSeats / 2 );
        this._rightOccupiedSeats = this._occupiedSeats - this._leftOccupiedSeats;

        // Se muestran los asientos ocupados a la izquierda y derecha
        this.leftSeats.fill( { name: 'square', occupied: true, color: 'danger' }, 0, this._leftOccupiedSeats - 1 );
        this.rightSeats.fill( { name: 'square', occupied: true, color: 'danger' }, 0, this._rightOccupiedSeats - 1 );

        // Se muestran los asientos libres de derecha e izquierda
        this.leftSeats.fill( { name: 'square-outline', occupied: false, color: '' }, this._leftOccupiedSeats - 1, this._totalSeats - 1 );
        this.rightSeats.fill( { name: 'square-outline', occupied: false, color: '' }, this._rightOccupiedSeats - 1, this._totalSeats - 1 );
      }

    } );
  }
}
