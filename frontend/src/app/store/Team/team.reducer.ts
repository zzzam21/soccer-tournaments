import { createReducer, on } from '@ngrx/store';
import { TeamActions } from './team.actions';
import { TeamState, initialTeamState } from './team.models';

export const teamReducer = createReducer<TeamState>(
  initialTeamState,
  on(TeamActions.load, (state) => ({ ...state, loading: true, error: null })),
  on(TeamActions.loadSuccess, (state, { list }) => ({ ...state, list, loading: false })),
  on(TeamActions.loadFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(TeamActions.create, (state) => ({ ...state, loading: true, error: null })),
  on(TeamActions.createSuccess, (state, { item }) => ({
    ...state,
    list: [...state.list, item],
    loading: false,
  })),
  on(TeamActions.createFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(TeamActions.update, (state) => ({ ...state, loading: true, error: null })),
  on(TeamActions.updateSuccess, (state, { item }) => ({
    ...state,
    list: state.list.map((t) => (t.id === item.id ? item : t)),
    selected: state.selected?.id === item.id ? item : state.selected,
    loading: false,
  })),
  on(TeamActions.updateFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(TeamActions.delete, (state) => ({ ...state, loading: true, error: null })),
  on(TeamActions.deleteSuccess, (state, { id }) => ({
    ...state,
    list: state.list.filter((t) => t.id !== id),
    selected: state.selected?.id === id ? null : state.selected,
    loading: false,
  })),
  on(TeamActions.deleteFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(TeamActions.select, (state, { team }) => ({ ...state, selected: team })),

  on(TeamActions.loadTournaments, (state) => ({ ...state, tournamentsLoading: true })),
  on(TeamActions.loadTournamentsSuccess, (state, { tournaments }) => ({
    ...state,
    tournaments,
    tournamentsLoading: false,
  })),
  on(TeamActions.loadTournamentsFailure, (state) => ({ ...state, tournamentsLoading: false })),
);
