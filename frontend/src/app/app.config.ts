import { ApplicationConfig, isDevMode, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { rootReducer } from './store';
import { AuthenticationEffects } from './store/Authentication/authentication.effects';
import { LayoutEffects } from './store/Layout/layout.effects';
import { TournamentEffects } from './store/Tournament/tournament.effects';
import { TeamEffects } from './store/Team/team.effects';
import { MatchEffects } from './store/Match/match.effects';
import { StatsEffects } from './store/Stats/stats.effects';
import { PlayerEffects } from './store/Player/player.effects';
import { provideDefaultClient } from '../client/providers';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CO' },
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' }),
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideDefaultClient({ basePath: environment.apiUrl }),
    provideStore(rootReducer),
    provideEffects(
      AuthenticationEffects,
      LayoutEffects,
      TournamentEffects,
      TeamEffects,
      MatchEffects,
      StatsEffects,
      PlayerEffects,
    ),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
