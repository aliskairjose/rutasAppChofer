import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { StorageService } from './services/storage.service';
import { TOKEN } from './constants/global-constants';
import { Plugins } from '@capacitor/core';

const { App, BackgroundTask } = Plugins;
@Component( {
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [ 'app.component.scss' ],
} )
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private storage: StorageService,
  ) {
    App.addListener( 'appStateChange', ( state ) => {

      if ( !state.isActive ) {
        // The app has become inactive. We should check if we have some work left to do, and, if so,
        // execute a background task that will allow us to finish that work before the OS
        // suspends or terminates our app:

        const taskId = BackgroundTask.beforeExit( async () => {
          // In this function We might finish an upload, let a network request
          // finish, persist some data, or perform some other task

          // Example of long task
          const start = new Date().getTime();
          for ( let i = 0; i < 1e18; i++ ) {
            if ( ( new Date().getTime() - start ) > 20000 ) {
              break;
            }
          }
          // Must call in order to end our task otherwise
          // we risk our app being terminated, and possibly
          // being labeled as impacting battery life
          BackgroundTask.finish( {
            taskId
          } );
        } );
      }
    } )
  }
  async ngOnInit() {
    const isLoggedin = await this.storage.get( TOKEN );
    const route = isLoggedin ? '/sidemenu/inicio' : '/initial';
    this.router.navigate( [ route ] );
  }


}
