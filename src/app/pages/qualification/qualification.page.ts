import { Component, OnInit } from '@angular/core';

@Component( {
  selector: 'app-qualification',
  templateUrl: './qualification.page.html',
  styleUrls: [ './qualification.page.scss' ],
} )
export class QualificationPage implements OnInit {

  face = '../../../assets/svg/faces/2.svg';
  rating = 2;
  serviceMesg = [
    'Pésimo servicio',
    'Servicio deficiente',
    'Servicio regular',
    'Buen servicio',
    'Servicio satisfactorio',
  ];
  msg = '';

  constructor() { }

  ngOnInit() {
  }

}
