import {Component, OnInit} from '@angular/core'
import {ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-auth-forms',
  templateUrl: './auth-forms.component.html',
  styleUrls: ['./auth-forms.component.css']
})
export class AuthFormsComponent implements OnInit {
  title: string

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.title = this.route.snapshot.url[0].path
  }
}
