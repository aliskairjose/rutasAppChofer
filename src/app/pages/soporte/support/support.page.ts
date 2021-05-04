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
    private common: CommonService,
  ) { }

  ngOnInit() {
  }

  async sendRequest() {
    // Send to api
    const loading = await this.common.presentLoading();
    loading.present();
    this._user.comment( this.comment ).subscribe( () => {
      loading.dismiss();
      const message = 'Su comentario ha sido procesado, gracias!';
      this.common.presentToast( { message } );
    } );
  }


}
