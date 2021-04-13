import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component( {
  selector: 'app-soporte',
  templateUrl: './soporte.page.html',
  styleUrls: [ './soporte.page.scss' ],
} )
export class SoportePage implements OnInit {


  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  goTo( route: string ): void {
    this.router.navigate( [ route ] );
  }
}
