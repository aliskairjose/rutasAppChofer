import { Component, OnInit, Input } from '@angular/core';
import { Client } from '../../interfaces/client';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LOGO, ERROR_FORM } from '../../constants/global-constants';
import { ModalController } from '@ionic/angular';
import { ClientsService } from '../../services/clients.service';
import { CommonService } from '../../services/common.service';

@Component( {
  selector: 'app-clients-modal',
  templateUrl: './clients-modal.page.html',
  styleUrls: [ './clients-modal.page.scss' ],
} )
export class ClientsModalPage implements OnInit {

  registerForm: FormGroup;
  submitted: boolean;
  logo = LOGO;
  formError = ERROR_FORM;
  clients: Client[] = [];

  @Input() user;

  constructor(
    private _fb: FormBuilder,
    private _common: CommonService,
    private _clientService: ClientsService,
    private modalController: ModalController,
  ) {
  }

  get f() { return this.registerForm.controls; }

  async ngOnInit() {
    this.createForm();
    this.clients = await this.loadClients();
  }

  async onSubmit() {
    this.submitted = true;
    if ( this.registerForm.valid ) {
      await this.modalController.dismiss( this.registerForm.value, 'submit' );
    }
  }

  async closeModal() {
    await this.modalController.dismiss( '', 'close' );
  }

  /**
   * @description Carga la lista de compañias
   * @returns Arreglo de Compañias (Clientes)
   */
  private loadClients(): Promise<Client[]> {
    return new Promise<Client[]>( async ( resolve ) => {
      const loading = await this._common.presentLoading();
      loading.present();
      this._clientService.list().subscribe( result => {
        loading.dismiss();
        resolve( result.data );
      } );
    } );
  }

  private createForm(): void {
    this.registerForm = this._fb.group( {
      google_id: [ this.user.id ],
      name: [ this.user.name ],
      email: [ this.user.email ],
      department: [ '', [ Validators.required ] ],
      charge: [ '', [ Validators.required ] ],
      client_id: [ '', [ Validators.required ] ],
    } );
  }

}
