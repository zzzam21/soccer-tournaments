import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Team } from '../Team/team.models';
import { Tournament, TeamStanding } from './tournament.models';

export const TournamentActions = createActionGroup({
  source: 'Tournament',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ list: Tournament[] }>(),
    'Load Failure': props<{ error: string }>(),
    Select: props<{ id: number }>(),

    Create: props<{
      name: string;
      city: string;
      tournament_type: string;
      status: string;
      start_date: string;
      end_date: string;
    }>(),
    'Create Success': props<{ item: Tournament }>(),
    'Create Failure': props<{ error: string }>(),

    Update: props<{
      id: number;
      name: string;
      city: string;
      tournament_type: string;
      status: string;
      start_date: string;
      end_date: string;
    }>(),
    'Update Success': props<{ item: Tournament }>(),
    'Update Failure': props<{ error: string }>(),

    Delete: props<{ id: number }>(),
    'Delete Success': props<{ id: number }>(),
    'Delete Failure': props<{ error: string }>(),

    'Load Tournament Teams': props<{ tournamentId: number }>(),
    'Load Tournament Teams Success': props<{ teams: Team[] }>(),
    'Load Tournament Teams Failure': props<{ error: string }>(),

    'Load Standings': props<{ tournamentId: number }>(),
    'Load Standings Success': props<{ standings: TeamStanding[] }>(),
    'Load Standings Failure': props<{ error: string }>(),

    'Add Team': props<{ tournamentId: number; teamId: number }>(),
    'Add Team Success': props<{ team: Team }>(),
    'Add Team Failure': props<{ error: string }>(),

    'Remove Team': props<{ tournamentId: number; teamId: number }>(),
    'Remove Team Success': props<{ teamId: number }>(),
    'Remove Team Failure': props<{ error: string }>(),
  },
});
