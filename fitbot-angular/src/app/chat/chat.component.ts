import {Component, OnInit} from '@angular/core'
import {AuthService} from '../auth/auth.service'
import {ChatService} from './chat.service'
import {MessagesService} from '../messages.service'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  busy: Boolean = false
  text: string = ''
  option: string = ''

  sessionUserIdLex: string
  sessionUserIdFlow: string
  sessionUserIdWatson: string

  constructor(
    public authService: AuthService,
    private chatService: ChatService,
    private messageService: MessagesService
  ) {}

  ngOnInit() {
    this.messageService.messages = []
    this.initializeBot()
  }

  initializeBot() {
    this.chatService.initializeBot(this.option).subscribe(
      ({sessionUserId, bot}) => {
        console.log(`${bot.type} Bot has been successfully initiated.`)

        this.sessionUserIdLex =
          bot.type === 'LEX' ? sessionUserId : this.sessionUserIdLex
        this.sessionUserIdFlow =
          bot.type === 'DIALOG_FLOW' ? sessionUserId : this.sessionUserIdFlow
        this.sessionUserIdWatson =
          bot.type === 'WATSON' ? sessionUserId : this.sessionUserIdWatson

        this.messageService.messages.push(
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

  handleChange() {
    let {
      option,
      sessionUserIdFlow,
      sessionUserIdLex,
      sessionUserIdWatson
    } = this

    let bot
    if (option === 'LEX') bot = sessionUserIdLex
    else if (option === 'DIALOG_FLOW') bot = sessionUserIdFlow
    else if (option === 'WATSON') bot = sessionUserIdWatson

    if (!bot) this.initializeBot()
    else {
      this.messageService.messages.push({
        type: 'status',
        content: `You are now chatting with ${option}`
      })
    }
  }

  handleSubmit() {
    const {text, option} = this

    if (!text) return

    const sent = {
      type: 'sent',
      content: this.text
    }

    this.busy = true
    this.messageService.messages.push(sent)
    this.text = ''

    let sessionUserId
    if (option === 'LEX') sessionUserId = this.sessionUserIdLex
    else if (option === 'DIALOG_FLOW') sessionUserId = this.sessionUserIdFlow
    else if (option === 'WATSON') sessionUserId = this.sessionUserIdWatson

    this.chatService.messageBot(sessionUserId, text, option).subscribe(
      data => {
        this.messageService.messages.push({
          type: 'received',
          content: `${option.toLowerCase()}: ${data.message}`
        })
        this.busy = false
      },
      err => console.error(err)
    )
  }
}
