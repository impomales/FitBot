import {Injectable} from '@angular/core'

export interface Message {
  type: String
  content: String
}

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  messages: Message[] = []

  constructor() {}
}
