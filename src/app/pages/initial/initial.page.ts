import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LOGO } from '../../constants/global-constants';

@Component( {
  selector: 'app-initial',
  templateUrl: './initial.page.html',
  styleUrls: [ './initial.page.scss' ],
} )
export class InitialPage implements OnInit {
  logo = LOGO;

  constructor( private router: Router ) { }

  ngOnInit() {
  }

  gotoSignup() {
    this.router.navigate( [ '/signin' ] );
  }

}
