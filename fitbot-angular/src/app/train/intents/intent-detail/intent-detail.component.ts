import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intent-detail',
  templateUrl: './intent-detail.component.html',
  styleUrls: ['./intent-detail.component.css']
})
export class IntentDetailComponent implements OnInit {
  trainingPhrases: string[] = ['how many calories in a cup of wine?', 'how many calories in 3 slices of pizza?']

  constructor() { }

  ngOnInit() {
  }

}
