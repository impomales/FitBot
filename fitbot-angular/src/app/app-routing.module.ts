import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'

import {ChatComponent} from './chat/chat.component'
import { AuthFormsComponent } from './auth-forms/auth-forms.component';
import { AuthGuard } from './auth/auth.guard'

const routes: Routes = [
  {path: '', redirectTo: '/chat', pathMatch: 'full'},
  {path: 'chat', component: ChatComponent, canActivate: [AuthGuard]},
  {path: 'login', component: AuthFormsComponent},
  {path: 'signup', component: AuthFormsComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
