import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ username: string; password: string }>(),
    'Login Success': props<{ user: any }>(),
    'Login Failure': props<{ error: string }>(),
    Register: props<{ username: string; email: string; password: string; confirm_password: string }>(),
    'Register Success': props<{ user: any }>(),
    'Register Failure': props<{ error: string }>(),
    'Clear Error': emptyProps(),
    Logout: emptyProps(),
    'Refresh Token': emptyProps(),
  },
});
