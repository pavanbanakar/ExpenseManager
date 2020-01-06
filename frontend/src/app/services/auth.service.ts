import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {

    baseUrl = 'http://localhost:4000';
    constructor(private http: HttpClient) {

    }

    login(email: string, password: string): Observable<boolean> {

        return this.http.post<{ token: string }>(this.baseUrl + '/users/login', { email, password }).pipe(map(result => {
            localStorage.setItem('access_token', result.token);
            return true;
        }));
    }

    logout() {
        localStorage.removeItem('access_token');
    }

    public get isLoggedin(): boolean {
        return (localStorage.getItem('access_token') !== null);
    }

    public get autToken(): any {
        return localStorage.getItem('access_token');
    }
}