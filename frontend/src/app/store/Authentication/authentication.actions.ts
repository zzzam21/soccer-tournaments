import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ username: string; password: string }>(),
    'Login Success': props<{ user: any }>(),
    'Login Failure': props<{ error: string }>(),
    'Clear Error': emptyProps(),
    Logout: emptyProps(),
    'Refresh Token': emptyProps(),
  },
});
