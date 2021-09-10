import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QualificationPageRoutingModule } from './qualification-routing.module';

import { QualificationPage } from './qualification.page';
import { SharedComponentsModule } from '../../Components/shared-components.module';

@NgModule( {
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QualificationPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [ QualificationPage ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
} )
export class QualificationPageModule { }
