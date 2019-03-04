import {Injectable} from '@angular/core'
import {Intent} from './intent.model'
import {TrainService} from '../train.service'

@Injectable({
  providedIn: 'root'
})
export class IntentService {
  constructor(private trainService: TrainService) {}

  getIntents(): Intent[] {
    return this.trainService.intents
  }

  getIntentByIndex(index: number): Intent {
    return this.trainService.intents[index]
  }
}
