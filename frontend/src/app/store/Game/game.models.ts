import type { Game } from '../../../client/models';

export interface GameEventItem {
  id: number;
  typeEvent: string;
  minute: number;
  game: number;
  player: number;
  playerName?: string;
}

export interface GameState {
  list: Game[];
  loading: boolean;
  error: string | null;
  events: GameEventItem[];
  eventsLoading: boolean;
  updating: boolean;
}

export const initialGameState: GameState = {
  list: [],
  loading: false,
  error: null,
  events: [],
  eventsLoading: false,
  updating: false,
};
