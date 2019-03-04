import {Injectable} from '@angular/core'
import {Intent, TrainingPhrase} from './intent.model'

@Injectable({
  providedIn: 'root'
})
export class IntentService {
  intents: Intent[] = [
    new Intent('greeting', [
      new TrainingPhrase('Hello', []),
      new TrainingPhrase('Hi', [])
    ]),
    new Intent('status', [
      new TrainingPhrase('What did I eat today', []),
      new TrainingPhrase("What's my status", [])
    ]),
    new Intent('help', [
      new TrainingPhrase('How do I use this', []),
      new TrainingPhrase('Help me', [])
    ]),
    new Intent('query-food', [
      new TrainingPhrase('How many calories in a doughnut', [])
    ]),
    new Intent('bye', [new TrainingPhrase('See you later', [])])
  ]
  
  constructor() {}

  getIntents(): Intent[] {
    return this.intents
  }

  getIntentByIndex(index: number): Intent {
    return this.intents[index]
  }
}
