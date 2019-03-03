import {Injectable} from '@angular/core'
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http'
import {User} from '../user'
import {Observable} from 'rxjs'
import {tap} from 'rxjs/operators'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false
  redirectUrl: string = '/'
  user: User
  error: string

  constructor(private http: HttpClient) {}

  me() {
    return this.http.get<User>('/auth/me').pipe(
      tap(user => {
        if (user) {
          this.isLoggedIn = true
          this.user = user
        }
      })
    )
  }

  auth(email: string, password: string, method: string): Observable<User> {
    return this.http
      .post<User>(`/auth/${method}`, {email, password}, httpOptions)
      .pipe(
        tap(
          user => {
            this.isLoggedIn = true
            this.user = user
            this.error = ''
          },
          err => {
            if (err.status === 401) {
              this.error = 'Wrong username and/or password'
            }
          }
        )
      )
  }

  logout(): Observable<HttpResponse<void>> {
    this.isLoggedIn = false
    this.user = null
    return this.http.post<void>(`/auth/logout`, {}, {...httpOptions, observe: 'response'})
  }
}
