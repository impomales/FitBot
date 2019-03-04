import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable, of} from 'rxjs'
import {Train} from './train.model'
import {catchError, tap} from 'rxjs/operators'
import {Entity} from './entities/entity.model'
import {Intent} from './intents/intent.model'

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
  entities: Entity[] = []
  intents: Intent[]

  constructor(private http: HttpClient) {}

  getTrainingData(): Observable<Train> {
    return this.http.get<Train>(this.loadUrl).pipe(
      tap(data => {
        this.trainingData = data
        this.generateEntities()
      }),
      catchError(this.handleError('getTrainingData', null))
    )
  }

  generateEntities() {
    const {common_examples, entity_synonyms} = this.trainingData.rasa_nlu_data
    const entitySet = new Set()

    const result = []

    common_examples.forEach(example => {
      if (example.entities) {
        example.entities.forEach(elem => {
          entitySet.add(elem.entity)
        })
      }
    })

    entitySet.forEach(setEntity => {
      const entity = {name: setEntity, values: []}
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

    console.log(this.entities)
  }

  updateTrainingData(): Observable<any> {
    return this.http
      .post<{message: string}>(
        this.updateUrl,
        {trainingData: this.trainingData},
        httpOptions
      )
      .pipe(catchError(this.handleError('updateTrainingData')))
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error)

      return of(result as T)
    }
  }
}
