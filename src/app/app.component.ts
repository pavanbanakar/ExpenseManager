import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'expense-manager';
 
  constructor(@Inject(DOCUMENT) private document:Document,private auth:AuthService,private router:Router){

  }
  ngOnInit(): void {
  
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['']);
  }
 
}
