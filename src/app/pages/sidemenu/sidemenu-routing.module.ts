import { InicioPage } from './../inicio/inicio.page';
import { InicioPageModule } from './../inicio/inicio.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SidemenuPage } from './sidemenu.page';
// import {InicioComponent} from '../../Components/inicio/inicio.component';
import { MapComponent } from '../../Components/map/map.component';
import { FeedbackPage } from '../feedback/feedback.page';
import { SoportePage } from '../soporte/soporte.page';
import { RoutePage } from '../route/route.page';
import { ExperiencePage } from '../experience/experience.page';
import { ProfilePage } from '../profile/profile.page';
import { IncidencesPage } from '../incidences/incidences.page';
import { RatingPage } from '../rating/rating.page';
import { QualificationPage } from '../qualification/qualification.page';

const routes: Routes = [
  {
    path: '',
    component: SidemenuPage,
    children: [
      {
        path: 'inicio',
        component: InicioPage
      },
      {
        path: 'profile',
        component: ProfilePage
      },
      {
        path: 'qualification',
        component: QualificationPage
      },
      {
        path: 'routes',
        component: RoutePage
      },
      {
        path: 'incidences',
        component: IncidencesPage
      }
    ]
  }
];
@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ],
} )
export class SidemenuPageRoutingModule { }
