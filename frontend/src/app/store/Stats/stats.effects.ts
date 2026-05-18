import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { UtilsService } from '../../../client/services/utils.service';
import { StatsActions } from './stats.actions';

@Injectable()
export class StatsEffects {
  private actions$ = inject(Actions);
  private utilsService = inject(UtilsService);

  loadStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatsActions.load),
      mergeMap(() =>
        this.utilsService.utilsStatsRetrieve().pipe(
          map((data) => StatsActions.loadSuccess({ data })),
          catchError((err) =>
            of(StatsActions.loadFailure({ error: err.message ?? 'Error loading stats' })),
          ),
        ),
      ),
    ),
  );
}
