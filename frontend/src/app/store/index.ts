import { ActionReducerMap } from '@ngrx/store';

import { AuthState } from './Authentication/auth.models';
import { authReducer } from './Authentication/authentication.reducer';
import { LayoutState } from './Layout/layout.models';
import { layoutReducer } from './Layout/layout.reducer';
import { TournamentState } from './Tournament/tournament.models';
import { tournamentReducer } from './Tournament/tournament.reducer';
import { TeamState } from './Team/team.models';
import { teamReducer } from './Team/team.reducer';
import { MatchState } from './Match/match.models';
import { matchReducer } from './Match/match.reducer';
import { StatsState } from './Stats/stats.models';
import { statsReducer } from './Stats/stats.reducer';
import { PlayerState } from './Player/player.models';
import { playerReducer } from './Player/player.reducer';

export interface RootReducerState {
  auth: AuthState;
  layout: LayoutState;
  tournament: TournamentState;
  team: TeamState;
  match: MatchState;
  stats: StatsState;
  player: PlayerState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
  auth: authReducer,
  layout: layoutReducer,
  tournament: tournamentReducer,
  team: teamReducer,
  match: matchReducer,
  stats: statsReducer,
  player: playerReducer,
};
