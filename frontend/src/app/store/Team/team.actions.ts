import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Team } from './team.models';

export const TeamActions = createActionGroup({
  source: 'Team',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ list: Team[] }>(),
    'Load Failure': props<{ error: string }>(),

    Create: props<{ name: string; tournament: number }>(),
    'Create Success': props<{ item: Team }>(),
    'Create Failure': props<{ error: string }>(),

    Update: props<{ id: number; name: string; tournament: number }>(),
    'Update Success': props<{ item: Team }>(),
    'Update Failure': props<{ error: string }>(),

    Delete: props<{ id: number }>(),
    'Delete Success': props<{ id: number }>(),
    'Delete Failure': props<{ error: string }>(),

    Select: props<{ team: Team | null }>(),

    'Load Tournaments': emptyProps(),
    'Load Tournaments Success': props<{ tournaments: { id: number; name: string }[] }>(),
    'Load Tournaments Failure': props<{ error: string }>(),
  },
});
