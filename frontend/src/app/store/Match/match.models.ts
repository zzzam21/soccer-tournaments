export interface Match {
  id: number;
  tournament: number;
  home_team: number;
  away_team: number;
  date: string;
  status: string;
}

export interface MatchState {
  list: Match[];
  loading: boolean;
  error: string | null;
}

export const initialMatchState: MatchState = {
  list: [],
  loading: false,
  error: null,
};
