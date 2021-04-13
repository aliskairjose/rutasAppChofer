import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidencesPageRoutingModule } from './incidences-routing.module';

import { IncidencesPage } from './incidences.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncidencesPageRoutingModule
  ],
  declarations: [IncidencesPage]
})
export class IncidencesPageModule {}
