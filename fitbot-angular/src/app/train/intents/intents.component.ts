import {Component, OnInit} from '@angular/core'
import {Intent} from './intent.model'
import {IntentService} from './intent.service'

@Component({
  selector: 'app-intents',
  templateUrl: './intents.component.html',
  styleUrls: ['./intents.component.css']
})
export class IntentsComponent implements OnInit {
  intents: Intent[]

  constructor(public intentService: IntentService) {}

  ngOnInit() {
    this.getIntents()
  }

  getIntents() {
    this.intents = this.intentService.getIntents()
  }
}
