import {Component, OnInit, Input} from '@angular/core'
import {Intent} from '../intent.model'
import {ActivatedRoute} from '@angular/router'
import {IntentService} from '../intent.service'

@Component({
  selector: 'app-intent-detail',
  templateUrl: './intent-detail.component.html',
  styleUrls: ['./intent-detail.component.css']
})
export class IntentDetailComponent implements OnInit {
  @Input() intent: Intent
  private subscribe: any

  constructor(
    private activatedRoute: ActivatedRoute,
    private intentService: IntentService
  ) {
    this.subscribe = this.activatedRoute.params.subscribe(params => {
      this.intent = this.intentService.getIntentByIndex(params['id'])
    })
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscribe.unsubscribe()
  }
}
