import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'

import {ChatComponent} from './chat/chat.component'
import { AuthFormsComponent } from './auth-forms/auth-forms.component';

const routes: Routes = [
  {path: '', redirectTo: '/chat', pathMatch: 'full'},
  {path: 'chat', component: ChatComponent},
  {path: 'login', component: AuthFormsComponent},
  {path: 'signup', component: AuthFormsComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
