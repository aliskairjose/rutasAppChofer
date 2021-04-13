import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { SharedComponentsModule } from '../../Components/shared-components.module';

@NgModule( {
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [ ProfilePage ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
} )
export class ProfilePageModule { }
