import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidentPlacePageRoutingModule } from './incident-place-routing.module';

import { IncidentPlacePage } from './incident-place.page';
import { AgmCoreModule } from '@agm/core';

@NgModule( {
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncidentPlacePageRoutingModule,
    AgmCoreModule.forRoot( {
      apiKey: 'AIzaSyAFfkk5FtmXgIsbHQzmEXsyFOACA4Jj_oY'
    } )
  ],
  declarations: [ IncidentPlacePage ]
} )
export class IncidentPlacePageModule { }
