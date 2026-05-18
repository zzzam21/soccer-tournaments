import { createSelector, createFeatureSelector } from '@ngrx/store';
import { StatsState, Stats } from './stats.models';

export const selectStatsState = createFeatureSelector<StatsState>('stats');
export const selectStatsData = createSelector(selectStatsState, (s) => s.data);
export const selectStatsLoading = createSelector(selectStatsState, (s) => s.loading);
export const selectStatsError = createSelector(selectStatsState, (s) => s.error);
