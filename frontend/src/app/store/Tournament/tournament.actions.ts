import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Tournament } from './tournament.models';

export const TournamentActions = createActionGroup({
  source: 'Tournament',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ list: Tournament[] }>(),
    'Load Failure': props<{ error: string }>(),
    Select: props<{ id: number }>(),
  },
});
