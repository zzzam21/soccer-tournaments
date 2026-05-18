export interface Tournament {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface TournamentState {
  list: Tournament[];
  selected: Tournament | null;
  loading: boolean;
  error: string | null;
}

export const initialTournamentState: TournamentState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};
