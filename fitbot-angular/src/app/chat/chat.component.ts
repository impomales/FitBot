import {Component, OnInit} from '@angular/core'
import {AuthService} from '../auth/auth.service'
import {ChatService, Bot, InitBotResponse} from './chat.service'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  busy: Boolean = false
  text: string = ''
  option: string = ''

  constructor(
    public authService: AuthService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.initializeBot()
  }

  initializeBot() {
    this.chatService.initializeBot(this.option).subscribe(
      (response: InitBotResponse) => {
        console.log(response)
      },
      err => console.error(err)
    )
  }
}
