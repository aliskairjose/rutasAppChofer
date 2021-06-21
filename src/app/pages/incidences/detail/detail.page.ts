import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { IncidenceService } from '../../../services/incidence.service';

@Component( {
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: [ './detail.page.scss' ],
} )
export class DetailPage implements OnInit {

  constructor(
    private common: CommonService,
    private route: ActivatedRoute,
    private incidenceService: IncidenceService,
  ) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get( 'id' );
    const loading = await this.common.presentLoading();
    loading.present();

    this.incidenceService.getById( id ).subscribe( response => {
      console.log( response );
      loading.dismiss();
    }, () => loading.dismiss() );

  }

}
