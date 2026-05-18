import { createReducer, on } from '@ngrx/store';
import { StatsActions } from './stats.actions';
import { StatsState, initialStatsState } from './stats.models';

export const statsReducer = createReducer<StatsState>(
  initialStatsState,
  on(StatsActions.load, (state) => ({ ...state, loading: true, error: null })),
  on(StatsActions.loadSuccess, (state, { data }) => ({
    ...state,
    data,
    loading: false,
    error: null,
  })),
  on(StatsActions.loadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
