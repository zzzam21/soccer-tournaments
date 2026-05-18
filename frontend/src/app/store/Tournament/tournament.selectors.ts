import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TournamentState } from './tournament.models';

export const selectTournamentState = createFeatureSelector<TournamentState>('tournament');
export const selectTournamentList = createSelector(selectTournamentState, (s) => s.list);
export const selectSelectedTournament = createSelector(selectTournamentState, (s) => s.selected);
export const selectTournamentLoading = createSelector(selectTournamentState, (s) => s.loading);
export const selectTournamentError = createSelector(selectTournamentState, (s) => s.error);
export const selectTournamentTeams = createSelector(selectTournamentState, (s) => s.tournamentTeams);
export const selectTournamentTeamsLoading = createSelector(selectTournamentState, (s) => s.tournamentTeamsLoading);
export const selectTournamentStandings = createSelector(selectTournamentState, (s) => s.standings);
export const selectTournamentStandingsLoading = createSelector(selectTournamentState, (s) => s.standingsLoading);
