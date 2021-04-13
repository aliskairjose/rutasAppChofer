import { Component, OnInit } from '@angular/core';
import { USER, BACK_BUTTON } from '../../constants/global-constants';
import { StorageService } from '../../services/storage.service';
import { User } from '../../interfaces/user';

@Component( {
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: [ './profile.page.scss' ],
} )
export class ProfilePage implements OnInit {
  user = {};
  buttonIcon = BACK_BUTTON;

  constructor(
    private _storage: StorageService
  ) { }

  async ngOnInit() {
    this.user = await this._storage.get( USER );
  }

}
