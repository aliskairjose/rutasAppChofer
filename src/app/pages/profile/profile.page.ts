import { Component, OnInit } from '@angular/core';
import { USER, BACK_BUTTON } from '../../constants/global-constants';
import { StorageService } from '../../services/storage.service';
import { User } from '../../interfaces/user';
import { Plugins, CameraResultType, CameraDirection } from '@capacitor/core';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

const { Camera } = Plugins;

@Component( {
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: [ './profile.page.scss' ],
} )
export class ProfilePage implements OnInit {
  user: User = {};
  buttonIcon = BACK_BUTTON;

  constructor(
    private _auth: AuthService,
    private _common: CommonService,
    private userService: UserService,
    private storage: StorageService
  ) {
    this._auth.authObserver().subscribe( ( user: any ) => this.user = { ...user } );
  }

  async ngOnInit() {
    this.storage.get( USER ).then( ( user: any ) => this.user = { ...user } );
  }

  async takePicture() {
    const image = await Camera.getPhoto( {
      quality: 30,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      direction: CameraDirection.Front // iOS and Web only
    } );

    const fileExt = this.user.avatar.includes( 'jpg' ) ? 'png' : 'jpg';

    const imageUrl = `data:image/${fileExt};base64,${image.base64String}`;
    const loading = await this._common.presentLoading();
    loading.present();
    this.userService.updateAvatar( { avatar: imageUrl } ).subscribe( async ( result ) => {
      loading.dismiss();
      await this.storage.store( USER, result.data );
      this._auth.AuthSubject( result.data );
      this.user = { ...result.data };
      const message = result.message;
      this._common.presentToast( { message } );
    }, () => loading.dismiss() );
  }

}
