import {Component, OnInit} from '@angular/core'
import {Intent} from './intent.model'
import {IntentService} from './intent.service'
import {FormGroup, FormControl, Validators} from '@angular/forms'

@Component({
  selector: 'app-intents',
  templateUrl: './intents.component.html',
  styleUrls: ['./intents.component.css']
})
export class IntentsComponent implements OnInit {
  intents: Intent[]
  createIntentForm: FormGroup

  constructor(public intentService: IntentService) {}

  ngOnInit() {
    this.getIntents()
    this.createIntentForm = new FormGroup({
      name: new FormControl(null, Validators.required)
    })
  }

  onSubmit() {
    this.intents.push({
      name: this.createIntentForm.get('name').value,
      trainingPhrases: []
    })
    this.createIntentForm.reset()
  }

  getIntents() {
    this.intents = this.intentService.getIntents()
  }
}
