import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {

  ipList = [
    {
      placeholder: 'Nombre',
      type: 'text',
      icon: 'person',
      errMsg_req: 'Field should not be empty',
      required: true,
      ctrlName: 'Nombre'
    },
    {
      placeholder: 'Empresa',
      type: 'dropdown',
      errMsg_req: 'Please select one',
      required: true,
      ctrlName: 'Empresa'
    },
    {
      placeholder: 'Departamento',
      type: 'text',
      icon: 'pricetag',
      errMsg_req: 'Field should not be empty',
      required: true,
      ctrlName: 'Departamento'
    },
    {
      placeholder: 'Cargo',
      type: 'email',
      icon: 'globe-outline',
      regEx: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      errMsg_req: 'Field should not be empty',
      errMsg_reg: 'Enter a valid email',
      required: true,
      ctrlName: 'Cargo'
    },
    {
      placeholder: 'Correo',
      type: 'text',
      icon: 'globe-outline',
      errMsg_req: 'Field should not be empty',
      required: true,
      ctrlName: 'Correo'
    },
    {
      placeholder: 'Contrasena',
      type: 'password',
      icon: 'key-outline',
      errMsg_req: 'Field should not be empty',
      required: true,
      ctrlName: 'Contrasena'
    },
    {
      placeholder: 'Repetir Contrasena',
      type: 'password',
      icon: 'key-outline',
      errMsg_req: 'Field should not be empty',
      required: true,
      ctrlName: 'repetir_contrasena'
    }
  ];

  public registerForm: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private router: Router
  ) {

    this.registerForm = formBuilder.group({
      Nombre: ['', Validators.compose([Validators.required])],
      Empresa: ['', Validators.compose([Validators.required])],
      Departamento: ['', Validators.compose([Validators.required])],
      Cargo: ['', Validators.compose([Validators.required, Validators.pattern(this.ipList[3].regEx)])],
      Correo: ['', Validators.compose([Validators.required])],
      Contrasena: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      repetir_contrasena: ['', Validators.compose([ Validators.required])]
    },
    {
      validator: this.ConfirmPasswordValidator('Contrasena', 'repetir_contrasena')
    });
  }

  ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmPasswordValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmPasswordValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  ngOnInit() {
  }

  gotoLogin(){
    this.router.navigate(['/signin']);
  }

  onChanges(){
    console.log('changes', this.registerForm);
  }

  // signup() {
  //   const email = this.registerForm.controls.email.value;
  //   const pass = this.registerForm.controls.password.value;
  //   const emailValid = this.registerForm.controls.email.valid;
  //   const passValid = this.registerForm.controls.password.valid;
  //   if (email && pass && emailValid && passValid) {
  //     localStorage.setItem('userToken', 'test-valid user');
  //     this.router.navigate(['/sidemenu/Inicio']);
  //   }
  // }
}
