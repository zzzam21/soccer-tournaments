import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TeamState } from './team.models';

export const selectTeamState = createFeatureSelector<TeamState>('team');
export const selectTeamList = createSelector(selectTeamState, (s) => s.list);
export const selectTeamLoading = createSelector(selectTeamState, (s) => s.loading);
export const selectSelectedTeam = createSelector(selectTeamState, (s) => s.selected);
export const selectTeamTournaments = createSelector(selectTeamState, (s) => s.tournaments);
export const selectTeamTournamentsLoading = createSelector(selectTeamState, (s) => s.tournamentsLoading);
export const selectTeamError = createSelector(selectTeamState, (s) => s.error);
