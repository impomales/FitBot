import {Component} from '@angular/core'
import {AuthService} from './auth/auth.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fitbot-angular'

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.me().subscribe(user => {
      if (user) {
        this.router.navigate([this.authService.redirectUrl])
      }
    })
  }
}
