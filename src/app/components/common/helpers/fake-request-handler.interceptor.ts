import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize,delay, dematerialize } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { Expense } from 'src/app/models/expense';


@Injectable()
export class FakeRequestHandler implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


        const users: User[] = [
            { id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User',email:'a@b.c' }
        ];

        
const EXPENSES: Expense[] = [
    { id: '1', title: 'one', date: new Date(), description: "one", userId: '1',amount:1.0 },
    { id: '2', title: 'TWO', date: new Date(), description: "one", userId: '1',amount:1.0  },
    { id: '3', title: 'three', date: new Date(), description: "one", userId: '1',amount:1.0  },
    { id: '4', title: 'four', date: new Date(), description: "one", userId: '1',amount:1.0  },
    { id: '5', title: 'five', date: new Date(), description: "one", userId: '1',amount:1.0  },
    { id: '6', title: 'six', date: new Date(), description: "one", userId: '1',amount:1.0  },
    { id: '7', title: 'seven', date: new Date(), description: "one", userId: '1',amount:1.0  },
    { id: '8', title: 'eight', date: new Date(), description: "one", userId: '1',amount:1.0  },
    { id: '9', title: 'nine', date: new Date(), description: "one", userId: '1',amount:1.0  },
    { id: '10', title: 'ten', date: new Date(), description: "one", userId: '1',amount:1.0  },
    { id: '11', title: 'eleven', date: new Date(), description: "one", userId: '1',amount:1.0  }
  
  
  ]
        const authHeader = req.headers.get('Authorization');
        const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-jwt-token');

        return of(null).pipe(mergeMap( () => {

            if (req.url.endsWith('/users/login') && req.method === 'POST') {
                const user = users.find(x => x.username === req.body.username && x.password === req.body.password);
                if (!user) return error('Username or password is incorrect');
                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: `fake-jwt-token`
                });
            }

            // get all users
            if (req.url.endsWith('/users') && req.method === 'GET') {
                if (!isLoggedIn) return unauthorised();
                return ok(users);
            }


            // get all expenses
            if(req.url.endsWith('/expenses') && req.method === 'GET'){
                if (!isLoggedIn) return unauthorised();
                return ok(EXPENSES);
            }

            return next.handle(req);
        })).pipe(materialize()).pipe(delay(1000)).pipe(dematerialize());

      
        
        function ok(body) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorised() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ status: 400, error: { message } });
        }
        
    }

}