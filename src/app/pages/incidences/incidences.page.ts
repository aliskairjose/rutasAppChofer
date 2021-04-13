import { Component, OnInit } from '@angular/core';

@Component( {
  selector: 'app-incidences',
  templateUrl: './incidences.page.html',
  styleUrls: [ './incidences.page.scss' ],
} )
export class IncidencesPage implements OnInit {

  icon = './../../../assets/svg/chat.svg';
  constructor() { }

  ngOnInit() {
  }

  search(): void {
    console.log( 'search' );
  }
}
