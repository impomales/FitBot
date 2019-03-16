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
  // sessionUserIdRasa: string

  constructor(
    public authService: AuthService,
    private chatService: ChatService,
    private messageService: MessagesService
  ) {}

  ngOnInit() {
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
        // this.sessionUserIdRasa =
        // bot.type === 'RASA' ? sessionUserId : this.sessionUserIdRasa

        this.messageService.push([
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
        ])

        // this.messageService.messages.push(
        //   {
        //     type: 'status',
        //     content: `You are now chatting with ${bot.type}`
        //   },
        //   {
        //     type: 'received',
        //     content: `${bot.type.toLowerCase()}: Hello, I am the ${
        //       bot.type
        //     } Fitbot. How can I help you?`
        //   }
        // )

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
      // sessionUserIdRasa
    } = this

    let bot
    if (option === 'LEX') bot = sessionUserIdLex
    else if (option === 'DIALOG_FLOW') bot = sessionUserIdFlow
    else if (option === 'WATSON') bot = sessionUserIdWatson
    // else if (option === 'RASA') bot = sessionUserIdRasa

    if (!bot) this.initializeBot()
    else {
      // this.messageService.messages.push({
      //   type: 'status',
      //   content: `You are now chatting with ${option}`
      // })
      this.messageService.push([
        {
          type: 'status',
          content: `You are now chatting with ${option}`
        }
      ])
    }
  }

  handleCardButton(value: string) {
    this.text = value
    this.handleSubmit()
  }

  handleSubmit() {
    const {text, option} = this

    if (!text) return

    const sent = {
      type: 'sent',
      content: this.text
    }

    this.busy = true
    this.messageService.push([sent])
    this.text = ''

    let sessionUserId: string
    if (option === 'LEX') sessionUserId = this.sessionUserIdLex
    else if (option === 'DIALOG_FLOW') sessionUserId = this.sessionUserIdFlow
    else if (option === 'WATSON') sessionUserId = this.sessionUserIdWatson
    // else if (option === 'RASA') sessionUserId = this.sessionUserIdRasa

    this.chatService.messageBot(sessionUserId, text, option).subscribe(
      data => {
        if (data.imageUrl) {
          this.messageService.push([
            {
              type: 'image',
              content: data.imageUrl
            }
          ])
        }

        this.messageService.push([
          {
            type: 'received',
            content: `${option.toLowerCase()}: ${data.message}`
          }
        ])

        if (data.responseCard) {
          data.responseCard.genericAttachments.forEach(attachment => {
            this.messageService.push([
              {
                type: 'card',
                content: attachment
              }
            ])
          })
        }
        // this.messageService.messages.push({
        //   type: 'received',
        //   content: `${option.toLowerCase()}: ${data.message}`
        // })
        this.busy = false
      },
      err => console.error(err)
    )
  }
}
