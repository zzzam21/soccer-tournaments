import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './authentication.actions';
import { AuthState, initialAuthState } from './auth.models';

export const authReducer = createReducer<AuthState>(
  initialAuthState,
  on(AuthActions.login, (state) => ({ ...state, loading: true, error: null })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    isAuthenticated: true,
    user,
    loading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AuthActions.logout, () => initialAuthState),
  on(AuthActions.clearError, (state) => ({ ...state, error: null })),
);
