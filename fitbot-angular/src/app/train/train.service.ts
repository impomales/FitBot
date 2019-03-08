import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable, of} from 'rxjs'
import {Train, Annotation} from './train.model'
import {catchError, tap} from 'rxjs/operators'
import {Entity} from './entities/entity.model'
import {Intent, TrainingPhrase} from './intents/intent.model'

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class TrainService {
  private loadUrl: string = 'api/bot/load_nlu'
  private updateUrl: string = 'api/bot/train'
  trainingData: Train
  entities: Entity[]
  intents: Intent[]
  colors = [
    'red',
    'blue',
    'green',
    'orange',
    'purple',
    'coral',
    'cyan',
    'maroon',
    'olive',
    'orchid',
    'plum'
  ]
  colorIndex: number = 0

  constructor(private http: HttpClient) {}

  getTrainingData(): Observable<Train> {
    return this.http.get<Train>(this.loadUrl).pipe(
      tap(data => {
        this.trainingData = data
        this.generateEntities()
        this.generateIntents()
      }),
      catchError(this.handleError(null))
    )
  }

  updateTrainingData(): Observable<any> {
    return this.http
      .post<{message: string}>(
        this.updateUrl,
        {trainingData: this.trainingData},
        httpOptions
      )
      .pipe(catchError(this.handleError(null)))
  }

  getNextColor() {
    const color = this.colors[this.colorIndex]
    this.colorIndex = (this.colorIndex + 1) % this.colors.length
    return color
  }

  generateIntents() {
    this.intents = []
    const {common_examples} = this.trainingData.rasa_nlu_data
    const intentSet = new Set()

    common_examples.forEach(example => {
      intentSet.add(example.intent)
    })

    intentSet.forEach(setIntent => {
      const intent = {name: setIntent, trainingPhrases: []}
      this.intents.push(intent)
      common_examples.forEach(example => {
        if (intent.name === example.intent) {
          intent.trainingPhrases.push({
            text: example.text,
            annotations: example.entities
          })
        }
      })
    })
  }

  generateEntities() {
    this.entities = []
    const {common_examples, entity_synonyms} = this.trainingData.rasa_nlu_data
    const entitySet = new Set()

    common_examples.forEach(example => {
      if (example.entities) {
        example.entities.forEach(elem => {
          entitySet.add(elem.entity)
        })
      }
    })

    entitySet.forEach(setEntity => {
      const entity = {
        name: setEntity,
        values: [],
        color: this.getNextColor()
      }

      const valueSet = new Set()
      common_examples.forEach(example => {
        if (example.entities) {
          example.entities.forEach(elem => {
            if (elem.entity === setEntity) {
              valueSet.add(elem.value)
            }
          })
        }
      })
      valueSet.forEach(setValue => {
        const value = {value: setValue, synonyms: []}

        entity_synonyms.forEach(elem => {
          if (elem.value === setValue) {
            value.synonyms = elem.synonyms
          }
        })
        entity.values.push(value)
      })

      this.entities.push(entity)
    })
  }

  addSynonym(value: string, synonyms: string[]) {
    const {entity_synonyms} = this.trainingData.rasa_nlu_data
    entity_synonyms.forEach(entityValue => {
      if (entityValue.value === value) {
        entityValue.synonyms = synonyms
        return
      }
    })

    entity_synonyms.push({value, synonyms})
  }

  addCommonExample(intentName: string, text: string) {
    const {common_examples} = this.trainingData.rasa_nlu_data
    common_examples.push({intent: intentName, text})
  }

  deleteCommonExample(text: string) {
    this.trainingData.rasa_nlu_data.common_examples = this.trainingData.rasa_nlu_data.common_examples.filter(
      example => example.text !== text
    )
  }

  addAnnotation(phrase: TrainingPhrase, annotation: Annotation) {
    const {common_examples} = this.trainingData.rasa_nlu_data
    common_examples.forEach(example => {
      if (example.text === phrase.text) {
        if (!example.entities) {
          example.entities = [annotation]
        } else {
          example.entities = example.entities.filter(
            elem => elem.value !== annotation.value
          )
          example.entities.push(annotation)
        }
      }
    })
  }

  deleteAnnotation(phrase: TrainingPhrase, value: string) {
    const {common_examples} = this.trainingData.rasa_nlu_data
    common_examples.forEach(example => {
      if (example.text === phrase.text) {
        example.entities = example.entities.filter(elem => elem.value !== value)
        if (example.entities.length === 0) delete example.entities
      }
    })
  }

  deleteEntity(index: number) {
    const entityName = this.entities[index].name
    const entityValues = this.entities[index].values
    this.entities[index] = null
    this.entities.splice(index, 1)

    // remove entities from intents
    this.intents.forEach(intent => {
      intent.trainingPhrases.forEach(phrase => {
        if (phrase.annotations) {
          phrase.annotations = phrase.annotations.filter(
            anotation => anotation.entity === entityName
          )
        }
      })
    })

    // remove entities from training data
    const {common_examples} = this.trainingData.rasa_nlu_data

    common_examples.forEach(example => {
      if (example.entities) {
        example.entities = example.entities.filter(
          anotation => anotation.entity !== entityName
        )

        if (example.entities.length === 0) {
          delete example.entities
        }
      }
    })

    const {rasa_nlu_data} = this.trainingData

    entityValues.forEach(entityValue => {
      rasa_nlu_data.entity_synonyms = rasa_nlu_data.entity_synonyms.filter(
        elem => elem.value !== entityValue.value
      )
    })
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error)

      return of(result as T)
    }
  }
}
