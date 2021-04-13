import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'initial',
    pathMatch: 'full'
  },
  {
    path: 'initial',
    loadChildren: () => import( './pages/initial/initial.module' ).then( m => m.InitialPageModule )
  },
  {
    path: 'signin',
    loadChildren: () => import( './pages/authentication/authentication.module' ).then( m => m.AuthenticationPageModule )
  },
  {
    path: 'forgot-password',
    loadChildren: () => import( './pages/forgot-password/forgot-password.module' ).then( m => m.ForgotPasswordPageModule )
  },
  {
    path: 'sidemenu',
    loadChildren: () => import( './pages/sidemenu/sidemenu.module' ).then( m => m.SidemenuPageModule )
  },
  {
    path: 'soporte',
    loadChildren: () => import( './pages/soporte/soporte.module' ).then( m => m.SoportePageModule )
  },
  {
    path: 'register',
    loadChildren: () => import( './pages/register/register.module' ).then( m => m.RegisterPageModule )
  },
  {
    path: 'clients-modal',
    loadChildren: () => import( './modals/clients-modal/clients-modal.module' ).then( m => m.ClientsModalPageModule )
  },
  {
    path: 'route',
    loadChildren: () => import('./pages/route/route.module').then( m => m.RoutePageModule)
  },
  {
    path: 'experience',
    loadChildren: () => import('./pages/experience/experience.module').then( m => m.ExperiencePageModule)
  },
  {
    path: 'rating',
    loadChildren: () => import('./pages/rating/rating.module').then( m => m.RatingPageModule)
  },  {
    path: 'incidences',
    loadChildren: () => import('./pages/incidences/incidences.module').then( m => m.IncidencesPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'qualification',
    loadChildren: () => import('./pages/qualification/qualification.module').then( m => m.QualificationPageModule)
  }



];

@NgModule( {
  imports: [
    RouterModule.forRoot( routes, { preloadingStrategy: PreloadAllModules } )
  ],
  exports: [ RouterModule ]
} )
export class AppRoutingModule { }
