import { Component, OnInit } from '@angular/core';
import { IncidenceService } from '../../services/incidence.service';
import { IncidenceData, Incidence } from '../../interfaces/incidence';
import { CommonService } from '../../services/common.service';
// import * as incidencias from './../../data/incidence.data.json';
import { StorageService } from '../../services/storage.service';
import { ACTIVE_ROUTE } from '../../constants/global-constants';
import { Route } from '../../interfaces/route';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
@Component( {
  selector: 'app-incidences',
  templateUrl: './incidences.page.html',
  styleUrls: [ './incidences.page.scss' ],
} )
export class IncidencesPage implements OnInit {

  icon = './../../../assets/svg/chat.svg';
  incidences: Incidence[] = [];
  initDate: string;
  endDate: string;
  currentDate: string;
  isDisabled = true;

  private data: IncidenceData;
  private iDate = new Date();
  private eDate = new Date();

  constructor(
    private router: Router,
    private common: CommonService,
    private storage: StorageService,
    private userService: UserService,
    private incidenceService: IncidenceService
  ) {
    this.initDate = `${this.iDate.getFullYear()}/${this.iDate.getMonth() + 1}/${this.iDate.getDate()}`;
    this.endDate = `${this.eDate.getFullYear()}/${this.eDate.getMonth() + 1}/${this.eDate.getDate()}`;
  }

  ngOnInit() {
    this.incidenceList();
  }

  search(): void {
    this.incidenceList();
  }

  changeDate( fecha: string, type: string ): void {
    if ( type === 'initDate' ) { this.initDate = fecha.slice( 0, 10 ); }
    if ( type === 'endDate' ) { this.endDate = fecha.slice( 0, 10 ); }
  }

  detail( incidence: Incidence ): void {
    this.router.navigate( [ `incidences/detail/${incidence.id}` ] );

  }

  onClick(): void {
    this.userService.rutasFlow = 0;
    this.router.navigate( [ '/sidemenu/inicio' ] );
  }

  async incidenceList() {
    const activeRoute: Route = await this.storage.get( ACTIVE_ROUTE ) as Route;
    this.data = {
      start_date: this.initDate,
      end_date: this.endDate
    };

    if ( activeRoute ) {
      this.isDisabled = false;
      this.data.route_id = activeRoute.id;
    }

    const loading = await this.common.presentLoading();
    loading.present();

    this.incidenceService.list( this.data ).subscribe( response => {
      loading.dismiss();
      this.incidences = [ ...response.data ];
    } );
  }

}
