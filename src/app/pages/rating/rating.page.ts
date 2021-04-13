import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RatingComponent} from '../../Components/rating/rating.component';
import {ModalController, NavParams} from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-page-rating',
  templateUrl: './rating.page.html',
  styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnInit {

  start: any;
  driver: {
    name: string,
  } = {
    name: 'Juan Perez',
  };
  destination: {
    type: string,
    name: string,
    hour_init: string,
    hour_end: string
  } = {
    type: 'Ruta Ciudad',
    name: 'Tocumen',
    hour_init: '08:00 AM',
    hour_end: '05:00 PM'
  };
  data;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public rating: RatingComponent,
    public navParams: NavParams,
    public modalController: ModalController,
    private _storage: StorageService,
  ) {
    this.data = this.navParams.get('modelId');
  }

  ngOnInit() {
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  sendRating() {
    this.modalController.dismiss();
    window.location.reload();
  }

}
