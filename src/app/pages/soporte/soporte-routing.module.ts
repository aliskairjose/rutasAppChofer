import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SoportePage } from './soporte.page';

const routes: Routes = [
  {
    path: '',
    component: SoportePage
  },  {
    path: 'support',
    loadChildren: () => import('./support/support.module').then( m => m.SupportPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SoportePageRoutingModule {}
