import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IncidenceService } from '../../../services/incidence.service';
import { CommonService } from '../../../services/common.service';
import { IncidenceType } from '../../../interfaces/incidence';
import { ERROR_FORM, ACTIVE_ROUTE } from '../../../constants/global-constants';
import { StorageService } from '../../../services/storage.service';
import { Route } from '../../../interfaces/route';
import { IncidentPlacePage } from '../../../modals/incident-place/incident-place.page';

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
  place = '';

  constructor(
    private fb: FormBuilder,
    private common: CommonService,
    private storage: StorageService,
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

    const activeRoute: Route = await this.storage.get( ACTIVE_ROUTE ) as Route;
    if ( activeRoute ) {
      this.incidenceForm.controls.route_id.patchValue( activeRoute.id );
    }
    if ( this.incidenceForm.valid ) {
      const loading = await this.common.presentLoading();
      loading.present();
      this.incidenceService.add( this.incidenceForm.value ).subscribe( ( response ) => {
        loading.dismiss();
        this.common.presentToast( { message: response.message } );
      }, () => loading.dismiss() );
    }
  }

  radioCheck( value: string ): void {
    this.incidenceForm.value.solution = value;
    ( value === '0' ) ? this.isHidde = true : this.isHidde = false;
    this.incidenceForm.controls.solve.patchValue( value );

  }

  /**
   * @description Registro del usuario google
   */
  async selectIncidentPlace(): Promise<void> {
    const modal = await this.common.presentModal( { component: IncidentPlacePage, cssClass: '' } );
    modal.present();
    const modalData = await modal.onDidDismiss();
    if ( modalData.data ) {
      this.place = modalData.data.place;
      this.incidenceForm.controls.lattitude.patchValue( modalData.data.lattitude );
      this.incidenceForm.controls.longitude.patchValue( modalData.data.longitude );
    }
  }

  private createForm(): void {
    this.incidenceForm = this.fb.group( {
      lattitude: [ '', [] ],
      longitude: [ '', [] ],
      type_incident_id: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      route_id: [ '' ],
      solution: [ '' ],
      solve: [ '0' ],
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
