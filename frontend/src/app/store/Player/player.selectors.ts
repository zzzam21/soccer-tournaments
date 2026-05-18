import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PlayerState } from './player.models';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');
export const selectPlayerList = createSelector(selectPlayerState, (s) => s.list);
export const selectPlayerLoading = createSelector(selectPlayerState, (s) => s.loading);
export const selectSelectedPlayer = createSelector(selectPlayerState, (s) => s.selected);
export const selectPlayerError = createSelector(selectPlayerState, (s) => s.error);
export const selectPlayerTeams = createSelector(selectPlayerState, (s) => s.teams);
export const selectPlayerTeamsLoading = createSelector(selectPlayerState, (s) => s.teamsLoading);
