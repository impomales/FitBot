import {Injectable} from '@angular/core'
import {Subject} from 'rxjs'

export interface Message {
  type: String
  content: String
}

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  subject: Subject<Message[]> = new Subject<Message[]>()

  constructor() {}

  push(messages: Message[]) {
    this.subject.next(messages)
  }
}
