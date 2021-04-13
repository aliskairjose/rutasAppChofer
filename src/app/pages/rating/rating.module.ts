import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RatingPageRoutingModule } from './rating-routing.module';
import { RatingPage } from './rating.page';
import { SharedComponentsModule } from 'src/app/Components/shared-components.module';
import {RatingComponent} from '../../Components/rating/rating.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RatingPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [RatingPage],
  providers: [RatingComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class RatingPageModule {}
