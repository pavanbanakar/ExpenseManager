import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { WelcomeComponent } from './components/common/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';

const routes: Routes = [
  {path:'',component:WelcomeComponent},
  {path:'expenses',component:ExpenseListComponent,canActivate:[AuthGuard]},
  {path:'register',component:RegistrationComponent},
  {path:'login',component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
