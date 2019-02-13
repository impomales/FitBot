import {Component, OnInit} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {AuthService} from '../auth/auth.service'

@Component({
  selector: 'app-auth-forms',
  templateUrl: './auth-forms.component.html',
  styleUrls: ['./auth-forms.component.css']
})
export class AuthFormsComponent implements OnInit {
  title: string
  email: string
  password: string

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.title = this.route.snapshot.url[0].path
  }

  handleSubmit() {
    const { email, password } = this
    this.email = ''
    this.password = ''
    return this.authService.auth(email, password, this.title).subscribe(user => {
      console.log(user)
      if (this.authService.isLoggedIn) {
        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/';
        this.router.navigate([redirect])
      }
    })
  }
}