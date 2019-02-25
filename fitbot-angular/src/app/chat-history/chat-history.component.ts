import {Component, OnInit, AfterViewChecked} from '@angular/core'
import {MessagesService, Message} from '../messages.service'

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.css']
})
export class ChatHistoryComponent implements OnInit, AfterViewChecked {
  messages: Message[] = []

  constructor(public messagesService: MessagesService) {}

  ngOnInit() {
    this.messagesService.subject.subscribe(data => {
      this.messages.push(...data)
    })
  }

  ngAfterViewChecked() {
    const messages = document.querySelector('#chat-history ul')
    if (messages.scrollTop + messages.clientHeight !== messages.scrollHeight) {
      messages.scrollTop = messages.scrollHeight
    }
  }
}
