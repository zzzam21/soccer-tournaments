import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './authentication.actions';

@Injectable()
export class AuthenticationEffects {
  constructor(private actions$: Actions) {}
}
