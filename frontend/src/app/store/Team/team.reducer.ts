import { createReducer, on } from '@ngrx/store';
import { TeamActions } from './team.actions';
import { TeamState, initialTeamState } from './team.models';

export const teamReducer = createReducer<TeamState>(
  initialTeamState,
  on(TeamActions.load, (state) => ({ ...state, loading: true, error: null })),
  on(TeamActions.loadSuccess, (state, { list }) => ({
    ...state,
    list,
    loading: false,
  })),
  on(TeamActions.loadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
