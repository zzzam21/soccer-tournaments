export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};
