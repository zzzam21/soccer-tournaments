export interface Stats {
  total_tournaments: number;
  total_teams: number;
  total_players: number;
  total_matches: number;
  total_games: number;
  total_goals: number;
  ongoing_tournaments: number;
  completed_tournaments: number;
}

export interface StatsState {
  data: Stats | null;
  loading: boolean;
  error: string | null;
}

export const initialStatsState: StatsState = {
  data: null,
  loading: false,
  error: null,
};
