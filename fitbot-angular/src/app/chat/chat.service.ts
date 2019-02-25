import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'

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
  constructor(private http: HttpClient) {}

  initializeBot(option: string): Observable<InitBotResponse> {
    return this.http.post<InitBotResponse>(
      '/api/bot/initiate',
      {option},
      httpOptions
    )
  }

  messageBot(
    sessionUserId: string,
    text: string,
    option: string
  ): Observable<MessageBotResponse> {
    return this.http.post<MessageBotResponse>(
      '/api/bot/message',
      {text, sessionUserId, option},
      httpOptions
    )
  }
}
