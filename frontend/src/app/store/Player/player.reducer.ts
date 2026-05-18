import { createReducer, on } from '@ngrx/store';
import { PlayerActions } from './player.actions';
import { PlayerState, initialPlayerState } from './player.models';

export const playerReducer = createReducer<PlayerState>(
  initialPlayerState,
  on(PlayerActions.load, (state) => ({ ...state, loading: true, error: null })),
  on(PlayerActions.loadSuccess, (state, { list }) => ({ ...state, list, loading: false })),
  on(PlayerActions.loadFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PlayerActions.create, (state) => ({ ...state, loading: true, error: null })),
  on(PlayerActions.createSuccess, (state, { item }) => ({
    ...state,
    list: [...state.list, item],
    loading: false,
  })),
  on(PlayerActions.createFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PlayerActions.update, (state) => ({ ...state, loading: true, error: null })),
  on(PlayerActions.updateSuccess, (state, { item }) => ({
    ...state,
    list: state.list.map((p) => (p.id === item.id ? item : p)),
    selected: state.selected?.id === item.id ? item : state.selected,
    loading: false,
  })),
  on(PlayerActions.updateFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PlayerActions.delete, (state) => ({ ...state, loading: true, error: null })),
  on(PlayerActions.deleteSuccess, (state, { id }) => ({
    ...state,
    list: state.list.filter((p) => p.id !== id),
    selected: state.selected?.id === id ? null : state.selected,
    loading: false,
  })),
  on(PlayerActions.deleteFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PlayerActions.select, (state, { player }) => ({ ...state, selected: player })),

  on(PlayerActions.loadTeams, (state) => ({ ...state, teamsLoading: true })),
  on(PlayerActions.loadTeamsSuccess, (state, { teams }) => ({ ...state, teams, teamsLoading: false })),
  on(PlayerActions.loadTeamsFailure, (state) => ({ ...state, teamsLoading: false })),
);
