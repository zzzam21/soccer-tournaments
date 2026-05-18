export interface Player {
  id: number;
  name: string;
  team?: number | null;
  photo?: string;
}

export interface PlayerState {
  list: Player[];
  selected: Player | null;
  loading: boolean;
  error: string | null;
  teams: { id: number; name: string }[];
  teamsLoading: boolean;
}

export const initialPlayerState: PlayerState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
  teams: [],
  teamsLoading: false,
};
