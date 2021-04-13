import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { LOGO, ERROR_FORM } from '../../constants/global-constants';
import { MustMatch } from '../../helpers/must-match.validator';

@Component( {
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: [ './register.page.scss' ],
} )
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  submitted: boolean;
  formError = ERROR_FORM;
  logo = LOGO;

  constructor(
    private _router: Router,
    private _auth: AuthService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
  ) {
    this.createForm();
  }

  get f() { return this.registerForm.controls; }

  ngOnInit() {
  }

  async onSubmit() {
    this.submitted = true;
    if ( this.registerForm.valid ) {
      const loading = await this._commonService.presentLoading();
      loading.present();
      this._auth.register( this.registerForm.value ).subscribe( () => {
        loading.dismiss();
        setTimeout( () => {
          this._router.navigate( [ '/signin' ] );
        }, 2000 );
      }, () => loading.dismiss() );
    }
  }

  private createForm(): void {
    this.registerForm = this._formBuilder.group( {
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required, Validators.minLength( 8 ) ] ],
      passwordConfirmation: [ '', [ Validators.required, Validators.minLength( 8 ) ] ],
    }, {
      validator: MustMatch( 'password', 'passwordConfirmation' ),
    } );
  }

}
