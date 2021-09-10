import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component( {
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: [ './rating.component.scss' ],
} )
export class RatingComponent implements OnInit {

  rating = [ 1, 2, 3, 4, 5 ];
  starHalf = false;

  @Input() rate = 0;
  @Input() size = 'small';
  @Input() readOnly = false;
  @Output() ratingChange: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }


  ratingHandler( i ) {
    if ( this.readOnly ) {
      return;
    }
    this.rate = i;
    this.ratingChange.emit( this.rate );
  }
}


