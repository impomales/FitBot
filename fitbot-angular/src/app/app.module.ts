import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {HttpClientModule} from '@angular/common/http'

import {AppRoutingModule} from './app-routing.module'
import {AppComponent} from './app.component'
import {NavbarComponent} from './navbar/navbar.component'
import {ChatComponent} from './chat/chat.component'
import {ChatHistoryComponent} from './chat-history/chat-history.component'
import {AuthFormsComponent} from './auth-forms/auth-forms.component'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ChatComponent,
    ChatHistoryComponent,
    AuthFormsComponent
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
