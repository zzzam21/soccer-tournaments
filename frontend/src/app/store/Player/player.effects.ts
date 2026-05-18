import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { PlayersService } from '../../../client/services/players.service';
import { TeamsService } from '../../../client/services/teams.service';
import { PlayerActions } from './player.actions';

@Injectable()
export class PlayerEffects {
  private actions$ = inject(Actions);
  private playersService = inject(PlayersService);
  private teamsService = inject(TeamsService);

  loadPlayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.load),
      mergeMap(() =>
        this.playersService.playersList().pipe(
          map((list) => PlayerActions.loadSuccess({ list })),
          catchError((err) =>
            of(PlayerActions.loadFailure({ error: err.message ?? 'Error al cargar jugadores' })),
          ),
        ),
      ),
    ),
  );

  createPlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.create),
      mergeMap(({ name, team, photo }) =>
        this.playersService.playersCreate(0, name, photo, team ?? null).pipe(
          map((item) => PlayerActions.createSuccess({ item })),
          catchError((err) =>
            of(PlayerActions.createFailure({ error: err.message ?? 'Error al crear jugador' })),
          ),
        ),
      ),
    ),
  );

  updatePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.update),
      mergeMap(({ id, name, team, photo }) =>
        this.playersService.playersPartialUpdate(id, name, photo, team ?? null).pipe(
          map((item) => PlayerActions.updateSuccess({ item })),
          catchError((err) =>
            of(PlayerActions.updateFailure({ error: err.message ?? 'Error al actualizar jugador' })),
          ),
        ),
      ),
    ),
  );

  deletePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.delete),
      mergeMap(({ id }) =>
        this.playersService.playersDestroy(id).pipe(
          map(() => PlayerActions.deleteSuccess({ id })),
          catchError((err) =>
            of(PlayerActions.deleteFailure({ error: err.message ?? 'Error al eliminar jugador' })),
          ),
        ),
      ),
    ),
  );

  loadTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.loadTeams),
      mergeMap(() =>
        this.teamsService.teamsList().pipe(
          map((teams) =>
            PlayerActions.loadTeamsSuccess({
              teams: teams.map((t) => ({ id: t.id, name: t.name })),
            }),
          ),
          catchError((err) =>
            of(PlayerActions.loadTeamsFailure({ error: err.message ?? 'Error al cargar equipos' })),
          ),
        ),
      ),
    ),
  );
}
