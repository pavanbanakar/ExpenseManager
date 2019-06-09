import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { MaterialModule } from './material-module';
import { NavigationComponent } from './components/common/navigation/navigation.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { WelcomeComponent } from './components/common/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { JwtModule } from '@auth0/angular-jwt';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { CustomErrorStateMatcher } from './services/custom-error-state-matcher';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    RegistrationComponent,
    WelcomeComponent,
    LoginComponent,
    ExpenseListComponent,
    ExpenseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('access_token'),
        whitelistedDomains: ['localhost:4000'],
        blacklistedRoutes: ['']
      }
    })
  ],
  providers: [
    AuthGuard,
    AuthService,
    { provide: ErrorStateMatcher, useClass: CustomErrorStateMatcher }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
