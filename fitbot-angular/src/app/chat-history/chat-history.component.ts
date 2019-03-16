import {
  Component,
  OnInit,
  AfterViewChecked,
  ViewChild,
  ElementRef
} from '@angular/core'
import {MessagesService, Message} from '../messages.service'

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.css']
})
export class ChatHistoryComponent implements OnInit, AfterViewChecked {
  messages: Message[] = []
  @ViewChild('messageList') private messageList: ElementRef

  constructor(public messagesService: MessagesService) {}

  ngOnInit() {
    this.messagesService.subject.subscribe(data => {
      this.messages.push(...data)
    })
  }

  ngAfterViewChecked() {
    if (
      this.messageList.nativeElement.scrollTop +
        this.messageList.nativeElement.clientHeight !==
      this.messageList.nativeElement.scrollHeight
    ) {
      this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight
    }
  }
}
