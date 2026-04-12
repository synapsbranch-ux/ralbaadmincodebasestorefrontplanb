import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(map(event => {
      if (event instanceof HttpResponse) {
        if (event.body['error'] == 1) {
          console.log('event Error JWT', event)
        }
      }
      return event;
    }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 || error.status === 410 || error.status === 412 || error.status === 404) {
          return throwError(error);
        }
        if (error.status === 401) {
          localStorage.removeItem('user_id');
          localStorage.removeItem('user_token');
          window.location.reload();
        } else {
          error.error.message = 'There is no Internet connection Please check once';
          return throwError(error);
        }
        // You can also log the error or perform other actions here
      })

    );
  }
}
