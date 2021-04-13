import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QualificationPage } from './qualification.page';

const routes: Routes = [
  {
    path: '',
    component: QualificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QualificationPageRoutingModule {}
