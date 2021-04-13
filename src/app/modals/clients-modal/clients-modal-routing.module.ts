import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientsModalPage } from './clients-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ClientsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsModalPageRoutingModule {}
