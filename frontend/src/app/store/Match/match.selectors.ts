import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MatchState } from './match.models';

export const selectMatchState = createFeatureSelector<MatchState>('match');
export const selectMatchList = createSelector(selectMatchState, (s) => s.list);
export const selectMatchLoading = createSelector(selectMatchState, (s) => s.loading);
export const selectMatchError = createSelector(selectMatchState, (s) => s.error);
export const selectSelectedMatch = createSelector(selectMatchState, (s) => s.selected);
export const selectMatchCreating = createSelector(selectMatchState, (s) => s.creating);
export const selectMatchUpdating = createSelector(selectMatchState, (s) => s.updating);
export const selectMatchDeleting = createSelector(selectMatchState, (s) => s.deleting);
export const selectMatchGames = createSelector(selectMatchState, (s) => s.matchGames);
export const selectMatchGamesLoading = createSelector(selectMatchState, (s) => s.gamesLoading);
