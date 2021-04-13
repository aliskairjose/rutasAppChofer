import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SidemenuPageRoutingModule } from './sidemenu-routing.module';
import { SharedComponentsModule } from 'src/app/Components/shared-components.module';
import { SidemenuPage } from './sidemenu.page';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';
import {RatingComponent} from '../../Components/rating/rating.component';
@NgModule( {
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SidemenuPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [ SidemenuPage ],
  exports: [],
  providers: [ NativePageTransitions, RatingComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
} )
export class SidemenuPageModule { }
