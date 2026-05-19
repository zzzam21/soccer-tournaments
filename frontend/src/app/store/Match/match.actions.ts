import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Match } from './match.models';
import type { Game } from '../../../client/models';

export const MatchActions = createActionGroup({
  source: 'Match',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ list: Match[] }>(),
    'Load Failure': props<{ error: string }>(),

    Create: props<{ number: number; start_date: string; tournament: number }>(),
    'Create Success': props<{ item: Match }>(),
    'Create Failure': props<{ error: string }>(),

    Update: props<{ id: number; number: number; start_date: string }>(),
    'Update Success': props<{ item: Match }>(),
    'Update Failure': props<{ error: string }>(),

    Delete: props<{ id: number }>(),
    'Delete Success': props<{ id: number }>(),
    'Delete Failure': props<{ error: string }>(),

    Select: props<{ id: number }>(),

    'Load Games': props<{ matchId: number }>(),
    'Load Games Success': props<{ games: Game[] }>(),
    'Load Games Failure': props<{ error: string }>(),

    'Create Game': props<{
      local_goals: number;
      visitant_goals: number;
      status: string;
      date: string;
      start_time?: string | null;
      match: number;
      local_team: number;
      visitant_team: number;
    }>(),
    'Create Game Success': props<{ game: Game }>(),
    'Create Game Failure': props<{ error: string }>(),

    'Delete Game': props<{ id: number; matchId: number }>(),
    'Delete Game Success': props<{ id: number; matchId: number }>(),
    'Delete Game Failure': props<{ error: string }>(),
  },
});
