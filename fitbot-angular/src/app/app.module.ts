import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {HttpClientModule} from '@angular/common/http'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {MatMenuModule, MatButtonModule} from '@angular/material'

import {AppRoutingModule} from './app-routing.module'
import {AppComponent} from './app.component'
import {NavbarComponent} from './navbar/navbar.component'
import {ChatComponent} from './chat/chat.component'
import {ChatHistoryComponent} from './chat-history/chat-history.component'
import {AuthFormsComponent} from './auth-forms/auth-forms.component'
import {TrainComponent} from './train/train.component'
import {IntentsComponent} from './train/intents/intents.component'
import {IntentDetailComponent} from './train/intents/intent-detail/intent-detail.component'
import {EntitiesComponent} from './train/entities/entities.component'
import {EntityDetailComponent} from './train/entities/entity-detail/entity-detail.component'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ChatComponent,
    ChatHistoryComponent,
    AuthFormsComponent,
    TrainComponent,
    IntentsComponent,
    IntentDetailComponent,
    EntitiesComponent,
    EntityDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
