import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./layouts/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'tournaments',
        loadComponent: () =>
          import('./features/tournaments/tournaments.component').then((m) => m.TournamentsComponent),
      },
      {
        path: 'teams',
        loadComponent: () =>
          import('./features/teams/teams.component').then((m) => m.TeamsComponent),
      },
      {
        path: 'matches',
        loadComponent: () =>
          import('./features/matches/matches.component').then((m) => m.MatchesComponent),
      },
      {
        path: 'games',
        loadComponent: () =>
          import('./features/games/games.component').then((m) => m.GamesComponent),
      },
      {
        path: 'players',
        loadComponent: () =>
          import('./features/players/players.component').then((m) => m.PlayersComponent),
      },
      { path: '', redirectTo: 'tournaments', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'auth/login' },
];
