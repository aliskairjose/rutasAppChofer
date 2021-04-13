import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExperiencePageRoutingModule } from './experience-routing.module';

import { ExperiencePage } from './experience.page';
import { SharedComponentsModule } from '../../Components/shared-components.module';

@NgModule( {
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, ,
    SharedComponentsModule,
    ExperiencePageRoutingModule,
  ],
  declarations: [ ExperiencePage ]
} )
export class ExperiencePageModule { }
