import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthToken } from './auth-token';

@Injectable()
export class AuthClientInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = AuthToken.get();
    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Token ${token}` } });
    }
    return next.handle(req);
  }
}
