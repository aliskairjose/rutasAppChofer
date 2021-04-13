import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { StorageService } from './services/storage.service';
import { TOKEN } from './constants/global-constants';
@Component( {
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [ 'app.component.scss' ],
} )
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private _storage: StorageService,
  ) {

  }
  async ngOnInit() {
    const isLoggedin = await this._storage.get( TOKEN );
    const route = isLoggedin ? '/sidemenu/inicio' : '/initial';
    this.router.navigate( [ route ] );
  }
}
