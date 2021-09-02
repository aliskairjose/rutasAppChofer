import { SoportePageModule } from './pages/soporte/soporte.module';
import { InicioPageModule } from './pages/inicio/inicio.module';
import { environment } from './../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SidemenuPageModule } from './pages/sidemenu/sidemenu.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { UserService } from './services/user.service';
import { FeedbackPageModule } from './pages/feedback/feedback.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { AgmCoreModule } from '@agm/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

registerLocaleData( localeEs );
@NgModule( {
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    IonicModule.forRoot( { mode: 'md' } ),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SidemenuPageModule,
    SoportePageModule,
    InicioPageModule,
    FeedbackPageModule,
    AngularFireModule.initializeApp( environment.firebase ),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AgmCoreModule.forRoot( {
      apiKey: 'AIzaSyAFfkk5FtmXgIsbHQzmEXsyFOACA4Jj_oY'
    } )
  ],
  providers: [
    GooglePlus,
    { provide: LOCALE_ID, useValue: 'es' },
    BackgroundGeolocation,
    Geolocation,
    NativeGeocoder,
    BackgroundMode,
    ForegroundService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [ AppComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
} )
export class AppModule {
  constructor( private userService: UserService ) {
    userService.subscribeBackHandler();
  }
}
