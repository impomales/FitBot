import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  logout() {
    this.isLoggedIn = !this.isLoggedIn
  }
}
