import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { TeamsService } from '../../../client/services/teams.service';
import { TournamentsService } from '../../../client/services/tournaments.service';
import { TeamActions } from './team.actions';

@Injectable()
export class TeamEffects {
  private actions$ = inject(Actions);
  private teamsService = inject(TeamsService);
  private tournamentsService = inject(TournamentsService);

  loadTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.load),
      mergeMap(() =>
        this.teamsService.teamsList().pipe(
          map((list) => TeamActions.loadSuccess({ list })),
          catchError((err) =>
            of(TeamActions.loadFailure({ error: err.message ?? 'Error al cargar equipos' })),
          ),
        ),
      ),
    ),
  );

  createTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.create),
      mergeMap(({ name, tournaments }) =>
        this.teamsService.teamsCreate(0, name, tournaments).pipe(
          map((item) => TeamActions.createSuccess({ item })),
          catchError((err) =>
            of(TeamActions.createFailure({ error: err.message ?? 'Error al crear equipo' })),
          ),
        ),
      ),
    ),
  );

  updateTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.update),
      mergeMap(({ id, name, tournaments }) =>
        this.teamsService.teamsPartialUpdate(id, name, tournaments).pipe(
          map((item) => TeamActions.updateSuccess({ item })),
          catchError((err) =>
            of(TeamActions.updateFailure({ error: err.message ?? 'Error al actualizar equipo' })),
          ),
        ),
      ),
    ),
  );

  deleteTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.delete),
      mergeMap(({ id }) =>
        this.teamsService.teamsDestroy(id).pipe(
          map(() => TeamActions.deleteSuccess({ id })),
          catchError((err) =>
            of(TeamActions.deleteFailure({ error: err.message ?? 'Error al eliminar equipo' })),
          ),
        ),
      ),
    ),
  );

  loadTournaments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.loadTournaments),
      mergeMap(() =>
        this.tournamentsService.tournamentsList().pipe(
          map((tournaments) =>
            TeamActions.loadTournamentsSuccess({
              tournaments: tournaments.map((t) => ({ id: t.id, name: t.name })),
            }),
          ),
          catchError((err) =>
            of(TeamActions.loadTournamentsFailure({ error: err.message ?? 'Error al cargar torneos' })),
          ),
        ),
      ),
    ),
  );
}
