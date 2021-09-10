import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidencesPage } from './incidences.page';

const routes: Routes = [
  {
    path: '',
    component: IncidencesPage
  },
  {
    path: 'add',
    loadChildren: () => import( './add/add.module' ).then( m => m.AddPageModule )
  },
  {
    path: 'detail/:id',
    loadChildren: () => import( './detail/detail.module' ).then( m => m.DetailPageModule )
  }
];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ],
} )
export class IncidencesPageRoutingModule { }
