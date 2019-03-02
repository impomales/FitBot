import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intents',
  templateUrl: './intents.component.html',
  styleUrls: ['./intents.component.css']
})
export class IntentsComponent implements OnInit {
  intents: string[] = ['greeting', 'status', 'help', 'query-food', 'bye']

  constructor() { }

  ngOnInit() {
  }

}
