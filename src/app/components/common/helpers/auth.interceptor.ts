import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private authService:AuthService){}
    intercept(req:HttpRequest<any>,next :HttpHandler):Observable<HttpEvent<any>>{

        if(this.authService.isLoggedin)
        {
            req = req.clone({
                setHeaders : {
                    "Authoriaztion" : `Bearer ${this.authService.autToken}`
                }
            });
        }

        return  next.handle(req);
    }

}