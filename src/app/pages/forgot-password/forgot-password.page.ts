import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ERROR_FORM, LOGO } from '../../constants/global-constants';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';

@Component( {
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: [ './../authentication/authentication.page.scss' ],
} )
export class ForgotPasswordPage implements OnInit {

  registerForgotForm: FormGroup;
  submitted: boolean;
  formError = ERROR_FORM;
  logo = LOGO;

  constructor(
    private router: Router,
    private _auth: AuthService,
    private _common: CommonService,
    private formBuilder: FormBuilder,
  ) {
    this.createForm();
  }

  get f() { return this.registerForgotForm.controls; }

  ngOnInit() {
  }

  async onSubmit() {
    this.submitted = true;
    if ( this.registerForgotForm.valid ) {
      const loading = await this._common.presentLoading();
      loading.present();
      this._auth.recoverPassword( this.registerForgotForm.value ).subscribe( () => {
        loading.dismiss();
        this.router.navigate( [ '/signin' ] );
      } );
    }
  }

  private createForm(): void {
    this.registerForgotForm = this.formBuilder.group(
      {
        email: [ '', [ Validators.required, Validators.email ] ]
      }
    );
  }

}
