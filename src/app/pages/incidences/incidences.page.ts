import { Component, OnInit } from '@angular/core';
import { IncidenceService } from '../../services/incidence.service';
import { IncidenceData, Incidence } from '../../interfaces/incidence';
import { CommonService } from '../../services/common.service';
// import * as incidencias from './../../data/incidence.data.json';
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

  private data: IncidenceData;
  private iDate = new Date();
  private eDate = new Date();

  constructor(
    private common: CommonService,
    private incidenceService: IncidenceService
  ) {
    this.initDate = `${this.iDate.getFullYear()}/${this.iDate.getMonth()}/${this.iDate.getDate()}`;
    this.endDate = `${this.eDate.getFullYear()}/${this.eDate.getMonth()}/${this.eDate.getDate()}`;

  }

  ngOnInit() {
    this.incidenceList();
    console.log( this.initDate );
    console.log( this.endDate );
  }

  search(): void {
    this.incidenceList();
  }

  changeDate( fecha: string, type: string ): void {
    if ( type === 'initDate' ) { this.initDate = fecha.slice( 0, 10 ); }
    if ( type === 'endDate' ) { this.endDate = fecha.slice( 0, 10 ); }
  }

  async incidenceList() {
    this.data = {
      includes: [ 'typeIncident', 'driver', 'route', 'solution' ],
      route_id: 14,
      type_incident_id: 7,
      start_date: this.initDate,
      end_date: this.endDate
    };

    const loading = await this.common.presentLoading();
    loading.present();

    this.incidenceService.list( this.data ).subscribe( response => {
      loading.dismiss();
      this.incidences = [ ...response.data ];
    } );
  }

}
