import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable, of} from 'rxjs'
import {Train} from './train.model'
import {catchError} from 'rxjs/operators'

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class TrainService {
  private loadUrl: string = 'api/bot/load_nlu'
  private updateUrl: string = 'api/bot/train'

  constructor(private http: HttpClient) {}

  getTrainingData(): Observable<Train> {
    return this.http
      .get<Train>(this.loadUrl)
      .pipe(catchError(this.handleError('getTrainingData', null)))
  }

  updateTrainingData(trainingData: Train): Observable<any> {
    return this.http
      .post<{message: string}>(this.updateUrl, { trainingData }, httpOptions)
      .pipe(catchError(this.handleError('updateTrainingData')))
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error)

      return of(result as T)
    }
  }
}
