import {Component, OnInit} from '@angular/core'
import {AuthService} from '../auth/auth.service'
import {ChatService} from './chat.service'

export interface Message {
  type: String
  content: String
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  busy: Boolean = false
  text: string = ''
  option: string = ''
  messages: Message[] = []

  constructor(
    public authService: AuthService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.initializeBot()
  }

  initializeBot() {
    this.chatService.initializeBot(this.option).subscribe(
      ({bot}) => {
        this.messages.push(
          {
            type: 'status',
            content: `You are now chatting with ${bot.type}`
          },
          {
            type: 'received',
            content: `${bot.type.toLowerCase()}: Hello, I am the ${
              bot.type
            } Fitbot. How can I help you?`
          }
        )

        this.option = bot.type
      },
      err => console.error(err)
    )
  }

  handleSubmit() {
    const {text, option} = this

    const sent = {
      type: 'sent',
      content: this.text
    }

    this.busy = true
    this.messages.push(sent)
    this.text = ''

    this.chatService.messageBot(text, option).subscribe(
      data => {
        this.messages.push({
          type: 'received',
          content: `${option.toLowerCase()}: ${data.message}`
        })
        this.busy = false
        console.log(this.messages)
      },
      err => console.error(err)
    )
  }
}
