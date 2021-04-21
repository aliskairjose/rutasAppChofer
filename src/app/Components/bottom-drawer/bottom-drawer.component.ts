import jsQR from 'jsqr';

import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import {
  NativePageTransitions, NativeTransitionOptions
} from '@ionic-native/native-page-transitions/ngx';
import { GestureController, LoadingController, NavController, Platform } from '@ionic/angular';

import { UserService } from '../../services/user.service';
import { Route } from '../../interfaces/route';
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { RatingPage } from '../../pages/rating/rating.page';
import { Bus } from '../../interfaces/bus';

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

  constructor(
    private plt: Platform,
    private router: Router,
    public navctl: NavController,
    // private qrScanner: QRScanner,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private gestureCtlr: GestureController,
    private nativePageTransitions: NativePageTransitions,
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

    this.gesture = await this.gestureCtlr.create( {
      el: this.bottomDrawerElement,
      gestureName: 'swipe',
      direction: 'y',
      onMove: ev => {
        // tslint:disable-next-line:curly
        if ( ev.deltaY < -this.openHeight ) return;
        // tslint:disable-next-line:curly
        if ( -ev.deltaY < -36.4705810546875 ) return;
        // tslint:disable-next-line:curly
        if ( ev.deltaY < 0 ) return;
        // tslint:disable-next-line:curly
        if ( ev.deltaY > 0 ) return;

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

  routeHandler( route: Route ) {
    this.userService.rutasData = this.selectedRoute = { ...route };
    this.bottomDrawerElement = this.bottomDrawer.nativeElement;
    this.gesture.enable( true );
    this.bottomDrawerElement.style.transition = '.4s ease-out';
    this.emitEvent.emit( {
      type: 'item-selected',
      data: route
    } );
    this.userService.rutasFlow = 10; // Detalle de ruta
  }

  async startScan() {
    this.userService.rutasFlow = 4;
    this.showScan = false;
    this.bottomDrawerElement = this.bottomDrawer.nativeElement;
    console.log( this.isOpen );
    this.toggleDrawer();
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

  async trackScroll( ele ) {
    this.seatElement = ele;
    this.seatGesture = await this.gestureCtlr.create( {
      el: this.seatElement,
      gestureName: 'swipe',
      direction: 'y',
      onStart: ev => {
        this.gesture.enable( true );
      },
      onEnd: ev => {
        this.gesture.enable( true );
      }
    } );
    this.seatGesture.enable( true );
  }

  openModal() {
    this.router.navigate( [ '/rating' ], { queryParams: { data: 'example data' } } );
  }

  endTravel( item ) {
    this.modalController.create( {
      component: RatingPage,
      componentProps: {
        data: 'example data',
      },
    } ).then( m => {
      m.onDidDismiss().then( d => {
        item = d;
      } );
      m.present();
    } );
  }

  // El chofer inicia la ruta al abordar
  startRoute(): void {
    console.log( 'startRoute' )
  }

}
