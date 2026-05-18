export interface Match {
  id: number;
  number: number;
  start_date: string;
  tournament: number;
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
