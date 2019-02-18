import {Component, AfterViewChecked} from '@angular/core'
import {MessagesService} from '../messages.service'

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.css']
})
export class ChatHistoryComponent implements AfterViewChecked {
  constructor(public messagesService: MessagesService) {}

  ngAfterViewChecked() {
    const messages = document.querySelector('#chat-history ul')
    if (messages.scrollTop + messages.clientHeight !== messages.scrollHeight) {
      messages.scrollTop = messages.scrollHeight
    }
  }
}
