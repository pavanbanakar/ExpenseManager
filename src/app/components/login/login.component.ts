import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;
  get email() {return this.loginForm.get('email')};
  get password () {return this.loginForm.get('password')};

  constructor(private snackBar:MatSnackBar,private authService:AuthService,private router:Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email : new FormControl('',[Validators.required,Validators.email]),
      password :new FormControl('',[Validators.required])
    })
  }

  resetForm()
  {
    this.loginForm.reset();
  }

  stopClicked(event,data){
    debugger;
  }

  submit(){

    if(this.loginForm.invalid)
    {
      this.snackBar.open("Please enter your email and password for a valid login!")
    }
    else{
      var that = this;
      this.authService.login(this.email.value,this.password.value).subscribe({
        next(r){
          that.router.navigate(['expenses'])
        },
        error(err){
          that.snackBar.open("Login Failed!")
        }
      })
    }
    
  }

}
