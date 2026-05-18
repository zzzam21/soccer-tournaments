import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { TournamentActions } from './tournament.actions';
import { TournamentsService } from '../../../client/services/tournaments.service';

@Injectable()
export class TournamentEffects {
  private actions$ = inject(Actions);
  private tournamentService = inject(TournamentsService);

  loadTournaments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.load),
      mergeMap(() =>
        this.tournamentService.tournamentsList().pipe(
          map((list) => TournamentActions.loadSuccess({ list })),
          catchError(() => of(TournamentActions.loadFailure({ error: 'Error al cargar torneos' }))),
        ),
      ),
    ),
  );
}
