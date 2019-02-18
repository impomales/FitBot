import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'
import {AuthService} from '../auth/auth.service'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

export class InitBotResponse {
  sessionUserId: string
  bot: Bot
}

export class Bot {
  type: string
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient, private authService: AuthService) {}
  initializeBot(option: string): Observable<InitBotResponse> {
    console.log(this.authService.user)
    return this.http.post<InitBotResponse>(
      '/api/bot/initiate',
      {option},
      httpOptions
    )
  }
}
