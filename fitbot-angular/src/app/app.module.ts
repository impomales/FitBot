import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {HttpClientModule} from '@angular/common/http'

import {AppRoutingModule} from './app-routing.module'
import {AppComponent} from './app.component'
import {NavbarComponent} from './navbar/navbar.component'
import {ChatComponent} from './chat/chat.component'
import {ChatHistoryComponent} from './chat-history/chat-history.component'
import {AuthFormsComponent} from './auth-forms/auth-forms.component';
import { TrainComponent } from './train/train.component';
import { IntentsComponent } from './train/intents/intents.component';
import { IntentDetailComponent } from './train/intents/intent-detail/intent-detail.component';
import { EntitiesComponent } from './train/entities/entities.component';
import { EntityDetailComponent } from './train/entities/entity-detail/entity-detail.component';

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
    EntityDetailComponent,
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
