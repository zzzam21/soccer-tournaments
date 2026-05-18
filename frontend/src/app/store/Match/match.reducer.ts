import { createReducer, on } from '@ngrx/store';
import { MatchActions } from './match.actions';
import { MatchState, initialMatchState } from './match.models';

export const matchReducer = createReducer<MatchState>(
  initialMatchState,
  on(MatchActions.load, (state) => ({ ...state, loading: true, error: null })),
  on(MatchActions.loadSuccess, (state, { list }) => ({
    ...state,
    list,
    loading: false,
  })),
  on(MatchActions.loadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
