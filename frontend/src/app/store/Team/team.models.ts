export interface Team {
  id: number;
  name: string;
  tournaments?: number[];
}

export interface TeamState {
  list: Team[];
  selected: Team | null;
  loading: boolean;
  error: string | null;
  tournaments: { id: number; name: string }[];
  tournamentsLoading: boolean;
}

export const initialTeamState: TeamState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
  tournaments: [],
  tournamentsLoading: false,
};
