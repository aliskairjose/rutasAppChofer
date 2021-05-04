import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { Route } from '../../interfaces/route';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';
import { ACTIVE_ROUTE } from '../../constants/global-constants';

@Component( {
  selector: 'app-route',
  templateUrl: './route.page.html',
  styleUrls: [ './route.page.scss' ],
} )
export class RoutePage implements OnInit {

  routes: Route[] = [];
  searchText = '';
  activeRoute: any = {
    id: 100
  };

  @Output() routeEvent: EventEmitter<Route> = new EventEmitter<Route>();

  constructor(
    private common: CommonService,
    private storage: StorageService,
    private _routeService: RouteService
  ) { }

  async ngOnInit() {
    const user: any = await this.storage.getUser();
    this.activeRoute = await this.storage.get( ACTIVE_ROUTE );
    const loading = await this.common.presentLoading();
    loading.present();
    this._routeService.list( user.id ).subscribe( ( routes: Route[] ) => {
      this.routes = [ ...routes ];
      loading.dismiss();
    }, () => loading.dismiss() );
  }

  selectRoute( route: Route ): void {
    this.routeEvent.emit( route );
  }

}
