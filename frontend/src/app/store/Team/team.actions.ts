import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Team } from './team.models';

export const TeamActions = createActionGroup({
  source: 'Team',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ list: Team[] }>(),
    'Load Failure': props<{ error: string }>(),
  },
});
