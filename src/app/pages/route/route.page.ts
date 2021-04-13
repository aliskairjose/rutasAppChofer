import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { Route } from '../../interfaces/route';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';
import { User } from '../../interfaces/user';

@Component( {
  selector: 'app-route',
  templateUrl: './route.page.html',
  styleUrls: [ './route.page.scss' ],
} )
export class RoutePage implements OnInit {

  routes: Route[] = [];
  searchText = '';

  @Output() routeEvent: EventEmitter<Route> = new EventEmitter<Route>();

  constructor(
    private _common: CommonService,
    private _storage: StorageService,
    private _routeService: RouteService
  ) { }

  async ngOnInit() {
    const user: any = await this._storage.getUser();
    const loading = await this._common.presentLoading();
    loading.present();
    this._routeService.list( user.client_id ).subscribe( ( routes: Route[] ) => {
      this.routes = [ ...routes ];
      loading.dismiss();
    } );
  }

  selectRoute( route: Route ): void {
    this.routeEvent.emit( route );
  }

}
