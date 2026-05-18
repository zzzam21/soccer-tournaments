import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TeamState } from './team.models';

export const selectTeamState = createFeatureSelector<TeamState>('team');
export const selectTeamList = createSelector(selectTeamState, (s) => s.list);
export const selectTeamLoading = createSelector(selectTeamState, (s) => s.loading);
