import {Injectable} from '@angular/core'
import {Intent} from './intent.model'

@Injectable({
  providedIn: 'root'
})
export class IntentService {
  intents: Intent[]

  constructor() {}

  getIntents(): Intent[] {
    return this.intents
  }

  getIntentByIndex(index: number): Intent {
    return this.intents[index]
  }
}
