import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {User} from '../user'
import {Observable} from 'rxjs'
import {tap} from 'rxjs/operators'
import {HttpHeaders} from '@angular/common/http'
import {Router} from '@angular/router'

const serverUrl = 'https://fitbot-cedrus.herokuapp.com'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false
  redirectUrl: string
  user: User
  error: string

  constructor(private http: HttpClient, private router: Router) {}

  auth(email: string, password: string, method: string): Observable<User> {
    return this.http
      .post<User>(`${serverUrl}/auth/${method}`, {email, password}, httpOptions)
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

  logout(): void {
    this.isLoggedIn = false
    this.user = null

    this.http.post<any>(`${serverUrl}/auth/logout`, {}, httpOptions)
  }
}
