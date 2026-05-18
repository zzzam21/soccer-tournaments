import { createReducer, on } from '@ngrx/store';
import { TournamentActions } from './tournament.actions';
import { TournamentState, initialTournamentState } from './tournament.models';

export const tournamentReducer = createReducer<TournamentState>(
  initialTournamentState,
  on(TournamentActions.load, (state) => ({ ...state, loading: true, error: null })),
  on(TournamentActions.loadSuccess, (state, { list }) => ({
    ...state,
    list,
    loading: false,
    error: null,
  })),
  on(TournamentActions.loadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TournamentActions.select, (state, { id }) => ({
    ...state,
    selected: state.list.find((t) => t.id === id) ?? null,
  })),
);
