import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GameEventItem } from './game.models';
import type { Game } from '../../../client/models';

export const GameActions = createActionGroup({
  source: 'Game',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ list: Game[] }>(),
    'Load Failure': props<{ error: string }>(),

    'Load Events': props<{ gameId: number }>(),
    'Load Events Success': props<{ events: GameEventItem[] }>(),
    'Load Events Failure': props<{ error: string }>(),

    'Create Event': props<{
      typeEvent: string;
      minute: number;
      game: number;
      player: number;
    }>(),
    'Create Event Success': props<{ event: GameEventItem }>(),
    'Create Event Failure': props<{ error: string }>(),

    'Delete Event': props<{ id: number; gameId: number }>(),
    'Delete Event Success': props<{ id: number }>(),
    'Delete Event Failure': props<{ error: string }>(),

    'Update Status': props<{ id: number; status: string }>(),
    'Update Status Success': props<{ item: Game }>(),
    'Update Status Failure': props<{ error: string }>(),

    'Update Time': props<{ id: number; start_time: string }>(),
    'Update Time Success': props<{ item: Game }>(),
    'Update Time Failure': props<{ error: string }>(),

    'Update Goals': props<{ id: number; local_goals: number; visitant_goals: number }>(),
    'Update Goals Success': props<{ item: Game }>(),
    'Update Goals Failure': props<{ error: string }>(),
  },
});
