import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'
import {AuthService} from '../auth/auth.service'
import {tap} from 'rxjs/operators'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

export interface InitBotResponse {
  sessionUserId: string
  bot: Bot
}

export interface MessageBotResponse {
  message: string
}

export interface Bot {
  type: string
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  sessionUserId: String

  constructor(private http: HttpClient, private authService: AuthService) {}

  initializeBot(option: string): Observable<InitBotResponse> {
    return this.http
      .post<InitBotResponse>('/api/bot/initiate', {option}, httpOptions)
      .pipe(tap(response => (this.sessionUserId = response.sessionUserId)))
  }

  messageBot(text: string, option: string): Observable<MessageBotResponse> {
    const {sessionUserId} = this
    return this.http.post<MessageBotResponse>(
      '/api/bot/message',
      {text, sessionUserId, option},
      httpOptions
    )
  }
}
