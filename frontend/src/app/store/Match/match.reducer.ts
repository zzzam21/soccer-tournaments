import { createReducer, on } from '@ngrx/store';
import { MatchActions } from './match.actions';
import { MatchState, initialMatchState } from './match.models';

export const matchReducer = createReducer<MatchState>(
  initialMatchState,
  on(MatchActions.load, (state) => ({ ...state, loading: true, error: null })),
  on(MatchActions.loadSuccess, (state, { list }) => ({ ...state, list, loading: false })),
  on(MatchActions.loadFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(MatchActions.create, (state) => ({ ...state, creating: true, error: null })),
  on(MatchActions.createSuccess, (state, { item }) => ({
    ...state,
    list: [...state.list, item],
    creating: false,
  })),
  on(MatchActions.createFailure, (state, { error }) => ({ ...state, creating: false, error })),

  on(MatchActions.update, (state) => ({ ...state, updating: true, error: null })),
  on(MatchActions.updateSuccess, (state, { item }) => ({
    ...state,
    list: state.list.map((m) => (m.id === item.id ? item : m)),
    selected: state.selected?.id === item.id ? item : state.selected,
    updating: false,
  })),
  on(MatchActions.updateFailure, (state, { error }) => ({ ...state, updating: false, error })),

  on(MatchActions.delete, (state) => ({ ...state, deleting: true, error: null })),
  on(MatchActions.deleteSuccess, (state, { id }) => ({
    ...state,
    list: state.list.filter((m) => m.id !== id),
    selected: state.selected?.id === id ? null : state.selected,
    deleting: false,
  })),
  on(MatchActions.deleteFailure, (state, { error }) => ({ ...state, deleting: false, error })),

  on(MatchActions.select, (state, { id }) => ({
    ...state,
    selected: state.list.find((m) => m.id === id) ?? null,
  })),

  on(MatchActions.loadGames, (state) => ({ ...state, gamesLoading: true })),
  on(MatchActions.loadGamesSuccess, (state, { games }) => ({
    ...state,
    matchGames: games,
    gamesLoading: false,
  })),
  on(MatchActions.loadGamesFailure, (state) => ({ ...state, gamesLoading: false })),

  on(MatchActions.createGame, (state) => ({ ...state, gamesLoading: true })),
  on(MatchActions.createGameSuccess, (state, { game }) => ({
    ...state,
    matchGames: [...state.matchGames, game],
    gamesLoading: false,
  })),
  on(MatchActions.createGameFailure, (state) => ({ ...state, gamesLoading: false })),

  on(MatchActions.deleteGame, (state) => ({ ...state, gamesLoading: true })),
  on(MatchActions.deleteGameSuccess, (state, { id }) => ({
    ...state,
    matchGames: state.matchGames.filter((g) => g.id !== id),
    gamesLoading: false,
  })),
  on(MatchActions.deleteGameFailure, (state) => ({ ...state, gamesLoading: false })),
);
