import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'

import {ChatComponent} from './chat/chat.component'
import { AuthFormsComponent } from './auth-forms/auth-forms.component';
import { AuthGuard } from './auth/auth.guard'
import { TrainComponent } from './train/train.component';
import { IntentsComponent } from './train/intents/intents.component';
import { EntitiesComponent } from './train/entities/entities.component';

const routes: Routes = [
  {path: '', redirectTo: '/chat', pathMatch: 'full'},
  {path: 'chat', component: ChatComponent, canActivate: [AuthGuard]},
  {path: 'train', component: TrainComponent, canActivate: [AuthGuard], children: [
    {path: 'entities', component: EntitiesComponent},
    {path: 'intents', component: IntentsComponent},
    {path: '', redirectTo: '/train/entities', pathMatch: 'full'}
  ]},
  {path: 'login', component: AuthFormsComponent},
  {path: 'signup', component: AuthFormsComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
