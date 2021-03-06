import {Component, OnInit, Input, OnDestroy} from '@angular/core'
import {Intent, TrainingPhrase} from '../intent.model'
import {ActivatedRoute} from '@angular/router'
import {IntentService} from '../intent.service'
import {TrainService} from '../../train.service'
import {Entity} from '../../entities/entity.model'
import {FormGroup, FormControl, Validators} from '@angular/forms'

@Component({
  selector: 'app-intent-detail',
  templateUrl: './intent-detail.component.html',
  styleUrls: ['./intent-detail.component.css']
})
export class IntentDetailComponent implements OnInit, OnDestroy {
  intent: Intent
  entities: Entity[]
  addPhraseForm: FormGroup
  private subscribe: any

  constructor(
    private activatedRoute: ActivatedRoute,
    private trainService: TrainService,
    private intentService: IntentService
  ) {
    this.subscribe = this.activatedRoute.params.subscribe(params => {
      this.intent = this.intentService.getIntentByIndex(params['id'])
    })
  }

  ngOnInit() {
    this.entities = this.trainService.entities
    this.addPhraseForm = new FormGroup({
      text: new FormControl(null, Validators.required)
    })
  }

  onSubmit() {
    const text = this.addPhraseForm.get('text').value
    this.intent.trainingPhrases.push({text, annotations: []})
    this.trainService.addCommonExample(this.intent.name, text)
    this.addPhraseForm.reset()
  }

  deletePhrase(phrase: TrainingPhrase) {
    this.intent.trainingPhrases = this.intent.trainingPhrases.filter(
      elem => elem.text !== phrase.text
    )
    this.trainService.deleteCommonExample(phrase.text)
  }

  addAnnotation(phrase: TrainingPhrase, entity: Entity, value: string) {
    let start = phrase.text.indexOf(value),
      end = start + value.length - 1
    const annotation = {start, end, entity: entity.name, value}

    if (!phrase.annotations) {
      phrase.annotations = [annotation]
    } else {
      phrase.annotations = phrase.annotations.filter(
        annotation => annotation.value !== value
      )
      phrase.annotations.push(annotation)
    }

    if (!entity.values.find(elem => elem.value === value))
      entity.values.push({value, synonyms: []})
    this.trainService.addAnnotation(phrase, annotation)
  }

  deleteAnnotation(phrase: TrainingPhrase, value: string) {
    phrase.annotations = phrase.annotations.filter(
      annotation => annotation.value !== value
    )
    // ** might need to handle synonyms differently **
    this.trainService.deleteAnnotation(phrase, value)
  }

  setColor(phrase: TrainingPhrase, word: string): {[s: string]: string} {
    if (!phrase.annotations) return
    let annotation = phrase.annotations.find(
      annotation => annotation.value === word
    )
    const {entities} = this.trainService
    const {entity_synonyms} = this.trainService.trainingData.rasa_nlu_data
    // if not found, check if word is a synonym.
    if (!annotation) {
      entity_synonyms.forEach(elem => {
        elem.synonyms.forEach(synonym => {
          if (word === synonym)
            annotation = phrase.annotations.find(
              annotation => annotation.value === elem.value
            )
        })
      })
    }

    if (!annotation) return

    for (let i = 0; i < entities.length; i++) {
      if (annotation.entity === entities[i].name) {
        const styleObj = {
          backgroundColor: entities[i].color,
          color: 'white'
        }
        return styleObj
      }
    }
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe()
  }
}
