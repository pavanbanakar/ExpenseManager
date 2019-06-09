import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  error:string;
  email:string;
  password:string;
  constructor(private snackBar:MatSnackBar,private authService:AuthService,private router:Router) { }

  ngOnInit() {
  }

  submit(){
    var that = this;
    this.authService.login(this.email,this.password).subscribe({
      next(r){
        that.router.navigate(['expenses'])
      },
      error(err){
        that.snackBar.open("Login Failed!")
      }
    })
  }

}
