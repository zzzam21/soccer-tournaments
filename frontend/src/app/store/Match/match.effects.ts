import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { MatchActions } from './match.actions';
import { MatchesService } from '../../../client/services/matches.service';
import { GamesService } from '../../../client/services/games.service';

@Injectable()
export class MatchEffects {
  private actions$ = inject(Actions);
  private matchesService = inject(MatchesService);
  private gamesService = inject(GamesService);

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

  createMatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MatchActions.create),
      mergeMap(({ number, start_date, tournament }) =>
        this.matchesService.matchesCreate(0, number, start_date, tournament).pipe(
          map((item) => MatchActions.createSuccess({ item })),
          catchError((err) =>
            of(MatchActions.createFailure({ error: err.message ?? 'Error al crear jornada' })),
          ),
        ),
      ),
    ),
  );

  updateMatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MatchActions.update),
      mergeMap(({ id, number, start_date }) =>
        this.matchesService.matchesPartialUpdate(id, number, start_date).pipe(
          map((item) => MatchActions.updateSuccess({ item })),
          catchError((err) =>
            of(MatchActions.updateFailure({ error: err.message ?? 'Error al actualizar jornada' })),
          ),
        ),
      ),
    ),
  );

  deleteMatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MatchActions.delete),
      mergeMap(({ id }) =>
        this.matchesService.matchesDestroy(id).pipe(
          map(() => MatchActions.deleteSuccess({ id })),
          catchError((err) =>
            of(MatchActions.deleteFailure({ error: err.message ?? 'Error al eliminar jornada' })),
          ),
        ),
      ),
    ),
  );

  loadGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MatchActions.loadGames),
      switchMap(({ matchId }) =>
        this.gamesService.gamesList().pipe(
          map((allGames) =>
            MatchActions.loadGamesSuccess({
              games: allGames.filter((g) => g.match === matchId),
            }),
          ),
          catchError(() => of(MatchActions.loadGamesFailure({ error: 'Error al cargar partidos' }))),
        ),
      ),
    ),
  );

  createGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MatchActions.createGame),
      mergeMap(({ local_goals, visitant_goals, status, date, start_time, match, local_team, visitant_team }) =>
        this.gamesService.gamesCreate(0, local_goals, visitant_goals, status, date, match, local_team, visitant_team, start_time).pipe(
          map((game) => MatchActions.createGameSuccess({ game })),
          catchError((err) =>
            of(MatchActions.createGameFailure({ error: err.message ?? 'Error al crear partido' })),
          ),
        ),
      ),
    ),
  );

  deleteGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MatchActions.deleteGame),
      mergeMap(({ id, matchId }) =>
        this.gamesService.gamesDestroy(id).pipe(
          map(() => MatchActions.deleteGameSuccess({ id, matchId })),
          catchError((err) =>
            of(MatchActions.deleteGameFailure({ error: err.message ?? 'Error al eliminar partido' })),
          ),
        ),
      ),
    ),
  );
}
