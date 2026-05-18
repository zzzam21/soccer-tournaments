import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TournamentState } from './tournament.models';

export const selectTournamentState = createFeatureSelector<TournamentState>('tournament');
export const selectTournamentList = createSelector(selectTournamentState, (s) => s.list);
export const selectSelectedTournament = createSelector(selectTournamentState, (s) => s.selected);
export const selectTournamentLoading = createSelector(selectTournamentState, (s) => s.loading);
