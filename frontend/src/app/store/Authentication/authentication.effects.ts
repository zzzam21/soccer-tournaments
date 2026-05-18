import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthActions } from './authentication.actions';
import { AuthService } from '../../core/auth/auth.service';
import { AuthToken } from '../../core/auth/auth-token';

@Injectable()
export class AuthenticationEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ username, password }) =>
        this.authService.login(username, password).pipe(
          map((response) => {
            AuthToken.set(response.token);
            return AuthActions.loginSuccess({ user: { username } });
          }),
          catchError((err) => {
            const error = err.error ?? {};
            const detail = error.non_field_errors?.[0] ?? error.detail;
            let message: string;

            if (err.status === 0) {
              message = 'Error de conexión con el servidor';
            } else if (err.status === 400 || err.status === 401) {
              message = 'Usuario o contraseña incorrectos';
            } else {
              message = detail ?? 'Ha ocurrido un error inesperado. Intenta de nuevo.';
            }

            return of(AuthActions.loginFailure({ error: message }));
          }),
        ),
      ),
    ),
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap((payload) =>
        this.authService.register(payload).pipe(
          map((response) => {
            AuthToken.set(response.token);
            return AuthActions.registerSuccess({ user: { username: response.username } });
          }),
          catchError((err) => {
            const error = err.error ?? {};
            const detail = error.non_field_errors?.[0] ?? error.detail;
            let message: string;

            if (err.status === 0) {
              message = 'Error de conexión con el servidor';
            } else if (err.status === 400) {
              const fieldErrors = Object.entries(error)
                .filter(([, v]) => Array.isArray(v))
                .map(([, v]) => (v as string[])[0])
                .join('. ');
              message = fieldErrors || detail || 'Datos inválidos. Revisa los campos.';
            } else {
              message = detail ?? 'Ha ocurrido un error inesperado. Intenta de nuevo.';
            }

            return of(AuthActions.registerFailure({ error: message }));
          }),
        ),
      ),
    ),
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/dashboard'])),
      ),
    { dispatch: false },
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/dashboard'])),
      ),
    { dispatch: false },
  );
}
