import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MatchState } from './match.models';

export const selectMatchState = createFeatureSelector<MatchState>('match');
export const selectMatchList = createSelector(selectMatchState, (s) => s.list);
export const selectMatchLoading = createSelector(selectMatchState, (s) => s.loading);
