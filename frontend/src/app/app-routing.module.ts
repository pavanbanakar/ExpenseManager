import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './components/common/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { RegisterProfileComponent } from './components/register-profile/register-profile.component';

const routes: Routes = [
  {path: '', component: WelcomeComponent},
  // {path:'expenses',component:ExpenseListComponent,canActivate:[AuthGuard]},
  {path: 'expenses', component: ExpenseListComponent},
   {path: 'login', component: LoginComponent},
  {path: 'expense/:id', component: ExpenseComponent},
  {path: 'register', component: RegisterProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
