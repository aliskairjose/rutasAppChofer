import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';

@Component( {
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: [ './support.page.scss' ],
} )
export class SupportPage implements OnInit {

  comment = '';

  constructor(
    private _user: UserService,
    private _common: CommonService,
  ) { }

  ngOnInit() {
  }

  async sendRequest() {
    // Send to api
    const loading = await this._common.presentLoading();
    loading.present();
    this._user.comment( this.comment ).subscribe( () => {
      loading.dismiss();
      const color = 'primary';
      const message = 'Su comentario ha sido procesado, gracias!';
      this._common.presentToast( { message, color } );
    } );
  }


}
