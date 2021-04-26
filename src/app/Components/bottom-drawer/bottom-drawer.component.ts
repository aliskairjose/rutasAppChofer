import jsQR from 'jsqr';

import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild
} from '@angular/core';
import { Plugins } from '@capacitor/core';
import { GestureController, NavController, Platform } from '@ionic/angular';

import { UserService } from '../../services/user.service';
import { Route } from '../../interfaces/route';
import { ModalController, PopoverController } from '@ionic/angular';
import { Bus } from '../../interfaces/bus';
import { RouteService } from '../../services/route.service';
import { CommonService } from '../../services/common.service';
import { User } from '../../interfaces/user';

const { Keyboard } = Plugins;

@Component( {
  selector: 'app-bottom-drawer',
  templateUrl: './bottom-drawer.component.html',
  styleUrls: [ './bottom-drawer.component.scss' ],
} )
export class BottomDrawerComponent implements AfterViewInit, OnInit {
  @ViewChild( 'bottomDrawer', { read: ElementRef } ) bottomDrawer: ElementRef;
  @ViewChild( 'seat' ) seat: ElementRef;
  @ViewChild( 'editRutas' ) editRutas: ElementRef;
  @ViewChild( 'video', { static: false } ) video: ElementRef;
  @ViewChild( 'canvas', { static: false } ) canvas: ElementRef;

  puesto = '../../../assets/svg/seat.svg';
  bottomDrawerElement: any;
  seatElement: any;
  videoElement: any;
  canvasElement: any;
  canvasContext: any;
  loading: HTMLIonLoadingElement;
  selectedRoute: Route = {};
  searchText = '';
  bus: Bus = {};

  @Output() emitEvent: EventEmitter<any> = new EventEmitter();
  @Input() component = 'Inicio';

  isOpen = false;
  openHeight;
  editOpenHeight;
  backdropVisible = false;
  searchList = [];
  bottomPosition = -65;
  gesture;
  seatGesture;
  dragable = true;
  rutasFlow = 0;
  scanActive = false;
  stream = null;
  seats = [];
  showScan = false;
  user: User = {};

  constructor(
    private plt: Platform,
    public navctl: NavController,
    private common: CommonService,
    private userService: UserService,
    private routeServie: RouteService,
    private gestureCtlr: GestureController,
    public popoverCtrl: PopoverController,
    public modalController: ModalController,
  ) {
    this.userService.flowhObserver().subscribe( flow => this.userService.rutasFlow = flow );
  }

  ngOnInit() {
    window.addEventListener( 'keyboardWillShow', ( e ) => {
      this.dragable = false;
      this.gesture.enable( false );
      if ( this.isOpen ) {
        this.toggleDrawer();
      }
    } );

    Keyboard.addListener( 'keyboardDidHide', () => {
      this.dragable = true;
      this.gesture.enable( true );
    } );
  }

  readJsonData( dataurl ) {
    return new Promise( ( resolve, reject ) => {
      fetch( dataurl ).then( res => res.json() ).then( jsonData => {
        resolve( jsonData );
      } ).catch( err => {
        resolve( {} );
      } );
    } );
  }

  async ngAfterViewInit() {
    this.bottomDrawerElement = this.bottomDrawer.nativeElement;
    this.openHeight = ( this.plt.height() / 100 ) * 60;

    this.gesture = this.gestureCtlr.create( {
      el: this.bottomDrawerElement,
      gestureName: 'swipe',
      direction: 'y',
      onMove: ev => {
        // tslint:disable-next-line:curly
        if ( ev.deltaY < -this.openHeight )
          return;
        // tslint:disable-next-line:curly
        if ( -ev.deltaY < -36.4705810546875 )
          return;
        // tslint:disable-next-line:curly
        if ( ev.deltaY < 0 )
          return;
        // tslint:disable-next-line:curly
        if ( ev.deltaY > 0 )
          return;

        this.bottomDrawerElement.style.transform = `translateY(${ev.deltaY}px)`;
      },
      onEnd: ev => {
        if ( ev.deltaY < -50 ) {
          this.bottomDrawerElement.style.transition = '.4s ease-out';
          this.bottomDrawerElement.style.transform = `translateY(${-this.openHeight}px)`;
          this.isOpen = true;
        }
        else if ( ev.deltaY > 50 ) {
          if ( this.userService.rutasFlow === 5 ) {
            this.bottomDrawerElement.style.transform = `translateY(${-this.openHeight / 2.56}px`;
          } else {
            this.bottomDrawerElement.style.transform = ``;
          }
          this.isOpen = false;
        }
      },
      onStart: ev => {
        console.log( 'mango', !this.isOpen );
      }
    } );
    this.gesture.enable( true );
  }

  toggleDrawer() {
    this.bottomDrawerElement = this.bottomDrawer.nativeElement;

    if ( this.isOpen ) {
      this.bottomDrawerElement.style.transition = '.4s ease-out';
      if ( this.userService.rutasFlow === 5 ) {
        this.bottomDrawerElement.style.transform = `translateY(${-this.openHeight / 2.56}px`;
      } else {
        this.bottomDrawerElement.style.transform = ``;
      }

      this.isOpen = false;
      return;
    }

    if ( !this.isOpen ) {
      this.bottomDrawerElement.style.transition = '.4s ease-out';
      this.bottomDrawerElement.style.transform = `translateY(${-this.openHeight}px`;
      this.isOpen = true;
      return;
    }

  }

  async routeHandler( route: Route ) {
    this.userService.rutasData = this.selectedRoute = { ...route };
    this.bottomDrawerElement = this.bottomDrawer.nativeElement;
    this.gesture.enable( true );
    this.bottomDrawerElement.style.transition = '.4s ease-out';
    this.emitEvent.emit( {
      type: 'item-selected',
      data: route
    } );

    const result = await this.verifyBoarding();

    this.userService.rutasFlow = ( result.hasBoarding ) ? 11 : 10;
  }

  goToHome() {
    this.openHeight = ( this.plt.height() / 100 ) * 60;
    this.userService.rutasFlow = 1;
    this.showScan = false;
    this.dragable = false;
    this.gesture.enable( true );
    this.bottomDrawerElement.style.transition = '.4s ease-out';
    this.bottomDrawerElement.style.transform = ``;

  }

  // El chofer inicia la ruta al abordar
  async startRoute() {
    const loading = await this.common.presentLoading();
    loading.present();
    this.routeServie.start( this.selectedRoute.id ).subscribe( result => {
      const message = result.message;
      this.common.presentToast( { message } );
      loading.dismiss();
      this.userService.rutasFlow = 11;
    } );
  }

  async endRoute() {
    const confirm = await this.common.alert();
    if ( confirm ) {

      const loading = await this.common.presentLoading();
      loading.present();
      this.routeServie.end().subscribe( result => {
        const message = result.message;
        loading.dismiss();
        this.common.presentToast( { message } );
        this.goToHome();
      } );
    }
  }

  // Asignación de puesto en el bus
  async assignSeat() {
    const loading = await this.common.presentLoading();
    loading.present();
    this.routeServie.assignSeat( this.selectedRoute.id ).subscribe( response => {
      loading.dismiss();
      this.common.presentToast( { message: response.message } )
      console.log( response );
    } );
  }


  private async verifyBoarding(): Promise<any> {
    return new Promise<any>( async ( resolve ) => {
      const loading = await this.common.presentLoading();
      loading.present();
      this.routeServie.verifyBorading().subscribe( response => {
        loading.dismiss();
        resolve( response );
      } );
    } );
  }

}
