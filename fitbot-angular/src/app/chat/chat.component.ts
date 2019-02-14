import {Component, OnInit} from '@angular/core'
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  busy: Boolean = false

  constructor(public authService: AuthService) {}

  ngOnInit() {
  }
}
