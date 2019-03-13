import {Component, OnInit} from '@angular/core'
import {Intent} from './intent.model'
import {IntentService} from './intent.service'
import {FormGroup, FormControl, Validators} from '@angular/forms'
import {TrainService} from '../train.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-intents',
  templateUrl: './intents.component.html',
  styleUrls: ['./intents.component.css']
})
export class IntentsComponent implements OnInit {
  intents: Intent[]
  createIntentForm: FormGroup
  paramId: string

  constructor(
    public intentService: IntentService,
    private trainService: TrainService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getIntents()
    this.createIntentForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        this.duplicateValidator.bind(this)
      ])
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

  deleteIntent(intent: Intent, index: number) {
    this.intents = this.intents.filter(elem => elem.name !== intent.name)
    this.trainService.deleteIntent(intent.name)
    this.paramId = this.router.url.split('/')[3]
    if (+this.paramId === index) this.router.navigate(['/train/intents'])
  }

  duplicateValidator(control: FormControl): {[key: string]: boolean} {
    if (
      this.intents.findIndex(intent => intent.name === control.value) !== -1
    ) {
      return {duplicate: true}
    }
    return null
  }
}
