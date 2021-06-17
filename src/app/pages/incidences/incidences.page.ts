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

  constructor(
    private common: CommonService,
    private incidenceService: IncidenceService
  ) { }

  ngOnInit() {
    this.incidenceList();
  }

  search(): void {
    console.log( 'search' );
  }

  async incidenceList() {
    const data: IncidenceData = {
      includes: [ 'typeIncident', 'driver', 'route', 'solution' ],
      route_id: 14,
      type_incident_id: 7,
      start_date: '2021-04-22',
      end_date: '2021-04-22'
    };
    const loading = await this.common.presentLoading();
    loading.present();

    this.incidenceService.list( data ).subscribe( response => {
      loading.dismiss();
      this.incidences = [ ...response.data ];
    } );
  }

}
