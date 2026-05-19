import { createSelector, createFeatureSelector } from '@ngrx/store';
import { GameState } from './game.models';

export const selectGameState = createFeatureSelector<GameState>('game');
export const selectGameList = createSelector(selectGameState, (s) => s.list);
export const selectGameLoading = createSelector(selectGameState, (s) => s.loading);
export const selectGameError = createSelector(selectGameState, (s) => s.error);
export const selectGameEvents = createSelector(selectGameState, (s) => s.events);
export const selectGameEventsLoading = createSelector(selectGameState, (s) => s.eventsLoading);
export const selectGameUpdating = createSelector(selectGameState, (s) => s.updating);
