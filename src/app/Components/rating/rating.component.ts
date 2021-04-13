import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {

  rate = 2;
  rating = [1,2,3,4,5]
  constructor() { }

  ngOnInit() {}

  ratingHandler(i) {
    this.rate = i;
  }
}


