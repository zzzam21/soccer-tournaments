import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class LayoutEffects {
  constructor(private actions$: Actions) {}
}
