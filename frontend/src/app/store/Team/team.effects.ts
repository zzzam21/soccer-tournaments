import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { TeamActions } from './team.actions';
import { TeamsService } from '../../../client/services/teams.service';

@Injectable()
export class TeamEffects {
  private actions$ = inject(Actions);
  private teamsService = inject(TeamsService);

  loadTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActions.load),
      mergeMap(() =>
        this.teamsService.teamsList().pipe(
          map((list) => TeamActions.loadSuccess({ list })),
          catchError(() => of(TeamActions.loadFailure({ error: 'Error al cargar equipos' }))),
        ),
      ),
    ),
  );
}
