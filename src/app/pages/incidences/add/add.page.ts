import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IncidenceService } from '../../../services/incidence.service';
import { CommonService } from '../../../services/common.service';
import { IncidenceType } from '../../../interfaces/incidence';
import { ERROR_FORM } from '../../../constants/global-constants';

@Component( {
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: [ './add.page.scss' ],
} )
export class AddPage implements OnInit {

  incidenceForm: FormGroup;
  submitted: boolean;
  isHidde = true;
  incidenceTypes: IncidenceType[] = [];
  errorForm = ERROR_FORM;

  constructor(
    private fb: FormBuilder,
    private common: CommonService,
    private incidenceService: IncidenceService,
  ) {
    this.createForm();
  }

  get f() { return this.incidenceForm.controls; }

  ngOnInit() {
    this.loadIncidenceTypes();
  }

  async onSubmit() {
    this.submitted = true;
    if ( this.incidenceForm.valid ) {
      const loading = await this.common.presentLoading();
      loading.present();
      this.incidenceService.add( this.incidenceForm.value ).subscribe( reponse => {
        loading.dismiss();

      }, () => loading.dismiss() );
    }
  }

  radioCheck( value: string ): void {
    this.incidenceForm.value.solution = value;
    ( value === 'no' ) ? this.isHidde = true : this.isHidde = false;
  }

  private createForm(): void {
    this.incidenceForm = this.fb.group( {
      lattitude: [ '', [ Validators.required ] ],
      longitude: [ '', [ Validators.required ] ],
      type_incident_id: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      route_id: [ '' ],
    } );
  }

  async loadIncidenceTypes() {
    const loading = await this.common.presentLoading();
    loading.present();
    this.incidenceService.types().subscribe( response => {
      loading.dismiss();
      this.incidenceTypes = [ ...response.data ];
    }, () => loading.dismiss() );
  }

}
