import {Injectable} from '@angular/core'
import {Observable, of} from 'rxjs'
import {delay, tap} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false
  redirectUrl: string

  constructor() {}

  login(): Observable<boolean> {
    return of(true).pipe(delay(100), tap(val => (this.isLoggedIn = true)))
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
