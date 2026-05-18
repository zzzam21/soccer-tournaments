import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.models';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectIsAuthenticated = createSelector(selectAuthState, (s) => s.isAuthenticated);
export const selectUser = createSelector(selectAuthState, (s) => s.user);
export const selectAuthLoading = createSelector(selectAuthState, (s) => s.loading);
export const selectAuthError = createSelector(selectAuthState, (s) => s.error);
