import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { MaterialModule } from './material-module';
import { NavigationComponent } from './components/common/navigation/navigation.component';
import { WelcomeComponent } from './components/common/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { ErrorStateMatcher } from '@angular/material';
import { CustomErrorStateMatcher } from './services/custom-error-state-matcher';
import { RegisterProfileComponent } from './components/register-profile/register-profile.component';
import { StopClickDirective } from './directives/stop.directive';
import { AuthInterceptor } from './components/common/helpers/auth.interceptor';
import { FakeRequestHandler } from './components/common/helpers/fake-request-handler.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    WelcomeComponent,
    LoginComponent,
    ExpenseListComponent,
    ExpenseComponent,
    RegisterProfileComponent,
    StopClickDirective
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
    HttpClientModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    { provide: ErrorStateMatcher, useClass: CustomErrorStateMatcher },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeRequestHandler, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorStateMatcher, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
