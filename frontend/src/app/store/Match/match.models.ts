import type { Game } from '../../../client/models';

export interface Match {
  id: number;
  number: number;
  start_date: string;
  tournament: number;
}

export interface MatchState {
  list: Match[];
  selected: Match | null;
  loading: boolean;
  error: string | null;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  matchGames: Game[];
  gamesLoading: boolean;
}

export const initialMatchState: MatchState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false,
  matchGames: [],
  gamesLoading: false,
};
