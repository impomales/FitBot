import {Component, OnInit} from '@angular/core'
import {AuthService} from '../auth/auth.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {}

  logout() {
    this.authService.logout().subscribe(resp => {
      this.router.navigate(['/login'])
    }, err => {
      if (err.status === 200) {
        this.router.navigate(['/login'])
      } else {
        console.error(`error in loggin user out. ${err.message}`)
      }
    })
  }
}
