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

  async scan() {

    if ( this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA ) {

      if ( this.loading ) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;
      this.canvasContext = this.canvasElement.getContext( '2d' );

      this.canvasContext.drawImage(
        this.videoElement, 0, 0, this.canvasElement.width, this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0, 0, this.canvasElement.width, this.canvasElement.height
      );

      const code = jsQR( imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      } );
      if ( code?.data ) {
        this.isOpen = false;
        this.scanActive = true;
        this.stopScan();
        this.bus = { ...JSON.parse( code.data ) };
        // this.stream.getTracks().forEach( track => track.stop() );
        this.gesture.enable( true );
        this.dragable = true;
        this.userService.rutasFlow = 40;
        this.emitEvent.emit( {
          type: 'scan-success'
        } );

      } else {
        if ( this.scanActive ) {
          requestAnimationFrame( this.scan.bind( this ) );
        }
      }

    } else {
      requestAnimationFrame( this.scan.bind( this ) );
    }
  }

  stopScan() {
    this.bottomDrawerElement = this.bottomDrawer.nativeElement;
    this.bottomDrawerElement.style.transition = '.4s ease-out';
    this.bottomDrawerElement.style.transform = '';
    this.stream.getTracks().forEach( track => track.stop() );
    this.gesture.enable( true );
    this.showScan = false;
    this.scanActive = false;
  }

  async scannerOn() {
    this.loading = await this.loadingCtrl.create( {} );
    await this.loading.present();
    this.showScan = true;
    this.stream = await navigator.mediaDevices.getUserMedia( { video: { facingMode: 'environment' } } );

    this.videoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.videoElement.srcObject = this.stream;
    this.videoElement.setAttribute( 'playsinline', true );
    this.videoElement.play();
    requestAnimationFrame( this.scan.bind( this ) );

  }

  goToFeedback() {
    this.emitEvent.emit( {
      type: 'stop-track'
    } );
    this.router.navigateByUrl( '/sidemenu/Feedback' );
    const options: NativeTransitionOptions = {
      direction: 'left',
      duration: 400,
      slowdownfactor: -1,
    };
    this.nativePageTransitions.slide( options );
    this.navctl.navigateRoot( '/sidemenu/Feedback' );
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
    //  console.log('prueba finalizar viaje / redireccion calificar');
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

}
