import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class MatchEffects {
  constructor(private actions$: Actions) {}
}
