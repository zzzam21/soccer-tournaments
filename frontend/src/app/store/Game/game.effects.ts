import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, filter, map, mergeMap, switchMap, of, take } from 'rxjs';

import { GameActions } from './game.actions';
import { GamesService } from '../../../client/services/games.service';
import { GameeventsService } from '../../../client/services/gameevents.service';
import { PlayersService } from '../../../client/services/players.service';
import { selectGameList } from './game.selectors';
import type { GameEventItem } from './game.models';

@Injectable()
export class GameEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private gamesService = inject(GamesService);
  private gameeventsService = inject(GameeventsService);
  private playersService = inject(PlayersService);

  loadGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.load),
      mergeMap(() =>
        this.gamesService.gamesList().pipe(
          map((list) => GameActions.loadSuccess({ list })),
          catchError(() => of(GameActions.loadFailure({ error: 'Error al cargar partidos' }))),
        ),
      ),
    ),
  );

  loadEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.loadEvents),
      switchMap(({ gameId }) =>
        this.playersService.playersList().pipe(
          switchMap((players) =>
            this.gameeventsService.gameeventsList().pipe(
              map((allEvents) => {
                const events: GameEventItem[] = allEvents
                  .filter((e) => e.game === gameId)
                  .map((e) => ({
                    ...e,
                    playerName: players.find((p) => p.id === e.player)?.name,
                  }));
                return GameActions.loadEventsSuccess({ events });
              }),
              catchError(() => of(GameActions.loadEventsFailure({ error: 'Error al cargar eventos' }))),
            ),
          ),
        ),
      ),
    ),
  );

  createEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.createEvent),
      mergeMap(({ typeEvent, minute, game, player }) =>
        this.gameeventsService.gameeventsCreate(0, typeEvent, minute, game, player).pipe(
          switchMap((created) =>
            this.playersService.playersList().pipe(
              map((players) =>
                GameActions.createEventSuccess({
                  event: {
                    ...created,
                    playerName: players.find((p) => p.id === created.player)?.name,
                  },
                }),
              ),
            ),
          ),
          catchError((err) =>
            of(GameActions.createEventFailure({ error: err.message ?? 'Error al crear evento' })),
          ),
        ),
      ),
    ),
  );

  deleteEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.deleteEvent),
      mergeMap(({ id }) =>
        this.gameeventsService.gameeventsDestroy(id).pipe(
          map(() => GameActions.deleteEventSuccess({ id })),
          catchError((err) =>
            of(GameActions.deleteEventFailure({ error: err.message ?? 'Error al eliminar evento' })),
          ),
        ),
      ),
    ),
  );

  updateStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.updateStatus),
      mergeMap(({ id, status }) =>
        this.gamesService.gamesPartialUpdate(id, undefined, undefined, status).pipe(
          map((item) => GameActions.updateStatusSuccess({ item })),
          catchError((err) =>
            of(GameActions.updateStatusFailure({ error: err.message ?? 'Error al actualizar estado' })),
          ),
        ),
      ),
    ),
  );

  updateTime$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.updateTime),
      mergeMap(({ id, start_time }) =>
        this.gamesService.gamesPartialUpdate(id, undefined, undefined, undefined, undefined, start_time).pipe(
          map((item) => GameActions.updateTimeSuccess({ item })),
          catchError((err) =>
            of(GameActions.updateTimeFailure({ error: err.message ?? 'Error al actualizar hora' })),
          ),
        ),
      ),
    ),
  );

  updateScoreOnGoal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.createEventSuccess),
      filter(({ event }) => event.typeEvent === 'Goal'),
      switchMap(({ event }) =>
        this.store.select(selectGameList).pipe(
          take(1),
          switchMap((games) => {
            const game = games.find((g) => g.id === event.game);
            if (!game) return EMPTY;
            return this.playersService.playersList().pipe(
              take(1),
              map((players) => {
                const player = players.find((p) => p.id === event.player);
                if (!player?.team) return null;
                const isLocal = player.team === game.local_team;
                return {
                  id: game.id,
                  local_goals: isLocal ? game.local_goals + 1 : game.local_goals,
                  visitant_goals: isLocal ? game.visitant_goals : game.visitant_goals + 1,
                };
              }),
              filter((update): update is { id: number; local_goals: number; visitant_goals: number } =>
                update !== null,
              ),
              map((update) => GameActions.updateGoals(update)),
            );
          }),
        ),
      ),
    ),
  );

  updateGoals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.updateGoals),
      mergeMap(({ id, local_goals, visitant_goals }) =>
        this.gamesService.gamesPartialUpdate(id, local_goals, visitant_goals).pipe(
          map((item) => GameActions.updateGoalsSuccess({ item })),
          catchError((err) =>
            of(GameActions.updateGoalsFailure({ error: err.message ?? 'Error al actualizar marcador' })),
          ),
        ),
      ),
    ),
  );
}
