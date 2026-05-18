import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Player } from './player.models';

export const PlayerActions = createActionGroup({
  source: 'Player',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ list: Player[] }>(),
    'Load Failure': props<{ error: string }>(),

    Create: props<{ name: string; team?: number | null; photo?: string }>(),
    'Create Success': props<{ item: Player }>(),
    'Create Failure': props<{ error: string }>(),

    Update: props<{ id: number; name: string; team?: number | null; photo?: string }>(),
    'Update Success': props<{ item: Player }>(),
    'Update Failure': props<{ error: string }>(),

    Delete: props<{ id: number }>(),
    'Delete Success': props<{ id: number }>(),
    'Delete Failure': props<{ error: string }>(),

    Select: props<{ player: Player | null }>(),

    'Load Teams': emptyProps(),
    'Load Teams Success': props<{ teams: { id: number; name: string }[] }>(),
    'Load Teams Failure': props<{ error: string }>(),
  },
});
