import { createReducer, on } from '@ngrx/store';
import { TournamentActions } from './tournament.actions';
import { TournamentState, initialTournamentState } from './tournament.models';

export const tournamentReducer = createReducer<TournamentState>(
  initialTournamentState,
  on(TournamentActions.load, (state) => ({ ...state, loading: true, error: null })),
  on(TournamentActions.loadSuccess, (state, { list }) => ({ ...state, list, loading: false })),
  on(TournamentActions.loadFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(TournamentActions.select, (state, { id }) => ({
    ...state,
    selected: state.list.find((t) => t.id === id) ?? null,
    standings: [],
    tournamentTeams: [],
  })),

  on(TournamentActions.create, (state) => ({ ...state, loading: true, error: null })),
  on(TournamentActions.createSuccess, (state, { item }) => ({
    ...state,
    list: [...state.list, item],
    loading: false,
  })),
  on(TournamentActions.createFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(TournamentActions.update, (state) => ({ ...state, loading: true, error: null })),
  on(TournamentActions.updateSuccess, (state, { item }) => ({
    ...state,
    list: state.list.map((t) => (t.id === item.id ? item : t)),
    selected: state.selected?.id === item.id ? item : state.selected,
    loading: false,
  })),
  on(TournamentActions.updateFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(TournamentActions.delete, (state) => ({ ...state, loading: true, error: null })),
  on(TournamentActions.deleteSuccess, (state, { id }) => ({
    ...state,
    list: state.list.filter((t) => t.id !== id),
    selected: state.selected?.id === id ? null : state.selected,
    loading: false,
  })),
  on(TournamentActions.deleteFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(TournamentActions.loadTournamentTeams, (state) => ({ ...state, tournamentTeamsLoading: true })),
  on(TournamentActions.loadTournamentTeamsSuccess, (state, { teams }) => ({
    ...state,
    tournamentTeams: teams,
    tournamentTeamsLoading: false,
  })),
  on(TournamentActions.loadTournamentTeamsFailure, (state) => ({ ...state, tournamentTeamsLoading: false })),

  on(TournamentActions.loadStandings, (state) => ({ ...state, standingsLoading: true })),
  on(TournamentActions.loadStandingsSuccess, (state, { standings }) => ({
    ...state,
    standings,
    standingsLoading: false,
  })),
  on(TournamentActions.loadStandingsFailure, (state) => ({ ...state, standingsLoading: false })),

  on(TournamentActions.addTeam, (state) => ({ ...state, loading: true })),
  on(TournamentActions.addTeamSuccess, (state, { team }) => ({
    ...state,
    tournamentTeams: [...state.tournamentTeams, team],
    loading: false,
  })),
  on(TournamentActions.addTeamFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(TournamentActions.removeTeam, (state) => ({ ...state, loading: true })),
  on(TournamentActions.removeTeamSuccess, (state, { teamId }) => ({
    ...state,
    tournamentTeams: state.tournamentTeams.filter((t) => t.id !== teamId),
    loading: false,
  })),
  on(TournamentActions.removeTeamFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
