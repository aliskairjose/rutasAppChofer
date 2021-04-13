import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientsModalPageRoutingModule } from './clients-modal-routing.module';

import { ClientsModalPage } from './clients-modal.page';

@NgModule( {
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ClientsModalPageRoutingModule
  ],
  declarations: [ ClientsModalPage ]
} )
export class ClientsModalPageModule { }
