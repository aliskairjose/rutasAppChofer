import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component( {
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: [ './add.page.scss' ],
} )
export class AddPage implements OnInit {

  incidenceForm: FormGroup;
  isSubmitted: boolean;
  isHidde = true;
  constructor(
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  radioCheck( value: string ): void {
    this.incidenceForm.value.solution = value;
    ( value === 'no' ) ? this.isHidde = true : this.isHidde = false;
  }

  private createForm(): void {
    this.incidenceForm = this.fb.group( {
      type: [ '', [ Validators.required ] ],
      place: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      solutionDescription: [ '' ],
      solution: [ '' ],
    } );
  }

}
