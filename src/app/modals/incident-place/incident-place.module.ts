import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidentPlacePageRoutingModule } from './incident-place-routing.module';

import { IncidentPlacePage } from './incident-place.page';

@NgModule( {
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncidentPlacePageRoutingModule
  ],
  declarations: [ IncidentPlacePage ]
} )
export class IncidentPlacePageModule { }
