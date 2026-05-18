export interface Team {
  id: number;
  name: string;
  logo?: string;
}

export interface TeamState {
  list: Team[];
  loading: boolean;
  error: string | null;
}

export const initialTeamState: TeamState = {
  list: [],
  loading: false,
  error: null,
};
