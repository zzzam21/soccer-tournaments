import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { MatchActions } from './match.actions';
import { MatchesService } from '../../../client/services/matches.service';

@Injectable()
export class MatchEffects {
  private actions$ = inject(Actions);
  private matchesService = inject(MatchesService);

  loadMatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MatchActions.load),
      mergeMap(() =>
        this.matchesService.matchesList().pipe(
          map((list) => MatchActions.loadSuccess({ list })),
          catchError(() => of(MatchActions.loadFailure({ error: 'Error al cargar jornadas' }))),
        ),
      ),
    ),
  );
}
