import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { StorageService } from '../../services/storage.service';
import { USER } from '../../constants/global-constants';
import { CommonService } from '../../services/common.service';
import { map, pluck, reduce } from 'rxjs/operators';
import { from } from 'rxjs';
import { Bus } from '../../interfaces/bus';
import { Route } from '../../interfaces/route';

@Component( {
  selector: 'app-qualification',
  templateUrl: './qualification.page.html',
  styleUrls: [ './qualification.page.scss' ],
} )
export class QualificationPage implements OnInit {

  face = '../../../assets/svg/faces/2.svg';
  rating = 0;
  serviceMesg = [
    'Mal Servicio',
    'Servicio Regular',
    'Buen Servicio',
    'Servicio satisfactorio',
    'Excelente Servicio',
  ];
  msg = '';
  routes: Route[] = [];

  constructor(
    private userService: UserService,
    private storage: StorageService,
    private common: CommonService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private async loadData() {
    const user: any = await this.storage.get( USER );
    const loading = await this.common.presentLoading();
    loading.present();
    this.userService.experience( user.id ).subscribe( response => {
      loading.dismiss();

      const rates = [];
      const source = from( response );
      const driverRate = source.pipe( pluck( 'driver_rate' ) );
      const route = source.pipe( map( val => val.route_boarding.route ) );

      driverRate.subscribe( val => rates.push( val ) );
      route.subscribe( _route => this.routes.push( _route ) );

      this.rating = Math.round( rates.reduce( ( a, b ) => a + b, 0 ) / response.length );
      if ( isNaN( this.rating ) ) { this.rating = 1; }
      this.face = `/assets/svg/faces/${this.rating}.svg`;
      this.msg = this.serviceMesg.find( ( item, index ) => index === this.rating - 1 );


    }, () => loading.dismiss() );
  }

}
