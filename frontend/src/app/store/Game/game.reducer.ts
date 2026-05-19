import { createReducer, on } from '@ngrx/store';
import { GameActions } from './game.actions';
import { GameState, initialGameState } from './game.models';

export const gameReducer = createReducer<GameState>(
  initialGameState,
  on(GameActions.load, (state) => ({ ...state, loading: true, error: null })),
  on(GameActions.loadSuccess, (state, { list }) => ({ ...state, list, loading: false })),
  on(GameActions.loadFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(GameActions.loadEvents, (state) => ({ ...state, eventsLoading: true })),
  on(GameActions.loadEventsSuccess, (state, { events }) => ({
    ...state,
    events,
    eventsLoading: false,
  })),
  on(GameActions.loadEventsFailure, (state) => ({ ...state, eventsLoading: false })),

  on(GameActions.createEvent, (state) => ({ ...state, eventsLoading: true })),
  on(GameActions.createEventSuccess, (state, { event }) => ({
    ...state,
    events: [...state.events, event],
    eventsLoading: false,
  })),
  on(GameActions.createEventFailure, (state) => ({ ...state, eventsLoading: false })),

  on(GameActions.deleteEvent, (state) => ({ ...state, eventsLoading: true })),
  on(GameActions.deleteEventSuccess, (state, { id }) => ({
    ...state,
    events: state.events.filter((e) => e.id !== id),
    eventsLoading: false,
  })),
  on(GameActions.deleteEventFailure, (state) => ({ ...state, eventsLoading: false })),

  on(GameActions.updateStatus, (state) => ({ ...state, updating: true })),
  on(GameActions.updateStatusSuccess, (state, { item }) => ({
    ...state,
    list: state.list.map((g) => (g.id === item.id ? item : g)),
    updating: false,
  })),
  on(GameActions.updateStatusFailure, (state) => ({ ...state, updating: false })),

  on(GameActions.updateTime, (state) => ({ ...state, updating: true })),
  on(GameActions.updateTimeSuccess, (state, { item }) => ({
    ...state,
    list: state.list.map((g) => (g.id === item.id ? item : g)),
    updating: false,
  })),
  on(GameActions.updateTimeFailure, (state) => ({ ...state, updating: false })),

  on(GameActions.updateGoals, (state) => ({ ...state, updating: true })),
  on(GameActions.updateGoalsSuccess, (state, { item }) => ({
    ...state,
    list: state.list.map((g) => (g.id === item.id ? item : g)),
    updating: false,
  })),
  on(GameActions.updateGoalsFailure, (state) => ({ ...state, updating: false })),
);
