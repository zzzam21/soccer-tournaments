import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Match } from './match.models';

export const MatchActions = createActionGroup({
  source: 'Match',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ list: Match[] }>(),
    'Load Failure': props<{ error: string }>(),
  },
});
