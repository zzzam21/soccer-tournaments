import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, forkJoin } from 'rxjs';
import { TournamentsService } from '../../../client/services/tournaments.service';
import { TeamsService } from '../../../client/services/teams.service';
import { MatchesService } from '../../../client/services/matches.service';
import { GamesService } from '../../../client/services/games.service';
import { TournamentActions } from './tournament.actions';
import { computeStandings } from '../../features/tournaments/standings.util';
import type { Game } from '../../../client/models';

@Injectable()
export class TournamentEffects {
  private actions$ = inject(Actions);
  private tournamentService = inject(TournamentsService);
  private teamsService = inject(TeamsService);
  private matchesService = inject(MatchesService);
  private gamesService = inject(GamesService);

  loadTournaments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.load),
      mergeMap(() =>
        this.tournamentService.tournamentsList().pipe(
          map((list) => TournamentActions.loadSuccess({ list })),
          catchError(() => of(TournamentActions.loadFailure({ error: 'Error al cargar torneos' }))),
        ),
      ),
    ),
  );

  createTournament$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.create),
      mergeMap(({ name, city, tournament_type, status, start_date, end_date }) =>
        this.tournamentService.tournamentsCreate(0, name, city, tournament_type, status, start_date, end_date).pipe(
          map((item) => TournamentActions.createSuccess({ item })),
          catchError((err) =>
            of(TournamentActions.createFailure({ error: err.message ?? 'Error al crear torneo' })),
          ),
        ),
      ),
    ),
  );

  updateTournament$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.update),
      mergeMap(({ id, name, city, tournament_type, status, start_date, end_date }) =>
        this.tournamentService
          .tournamentsPartialUpdate(id, name, city, tournament_type, status, start_date, end_date)
          .pipe(
            map((item) => TournamentActions.updateSuccess({ item })),
            catchError((err) =>
              of(TournamentActions.updateFailure({ error: err.message ?? 'Error al actualizar torneo' })),
            ),
          ),
      ),
    ),
  );

  deleteTournament$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.delete),
      mergeMap(({ id }) =>
        this.tournamentService.tournamentsDestroy(id).pipe(
          map(() => TournamentActions.deleteSuccess({ id })),
          catchError((err) =>
            of(TournamentActions.deleteFailure({ error: err.message ?? 'Error al eliminar torneo' })),
          ),
        ),
      ),
    ),
  );

  loadTournamentTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.loadTournamentTeams),
      switchMap(({ tournamentId }) =>
        this.teamsService.teamsList().pipe(
          map((allTeams) =>
            TournamentActions.loadTournamentTeamsSuccess({
              teams: allTeams.filter((t) => t.tournaments?.includes(tournamentId)),
            }),
          ),
          catchError((err) =>
            of(TournamentActions.loadTournamentTeamsFailure({ error: err.message ?? 'Error al cargar equipos' })),
          ),
        ),
      ),
    ),
  );

  loadStandings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.loadStandings),
      switchMap(({ tournamentId }) =>
        forkJoin([
          this.teamsService.teamsList(),
          this.matchesService.matchesList(),
          this.gamesService.gamesList(),
        ]).pipe(
          map(([allTeams, allMatches, allGames]) => {
            const tournamentTeams = allTeams.filter((t) => t.tournaments?.includes(tournamentId));
            const matchIds = allMatches
              .filter((m) => m.tournament === tournamentId)
              .map((m) => m.id);
            const tournamentGames = allGames.filter((g) => matchIds.includes(g.match));
            const standings = computeStandings(tournamentTeams, tournamentGames as Game[]);
            return TournamentActions.loadStandingsSuccess({ standings });
          }),
          catchError((err) =>
            of(TournamentActions.loadStandingsFailure({ error: err.message ?? 'Error al cargar estadísticas' })),
          ),
        ),
      ),
    ),
  );

  addTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.addTeam),
      switchMap(({ tournamentId, teamId }) =>
        this.teamsService.teamsRetrieve(teamId).pipe(
          switchMap((team) =>
            this.teamsService.teamsPartialUpdate(teamId, team.name, [
              ...(team.tournaments ?? []),
              tournamentId,
            ]),
          ),
          map((team) => TournamentActions.addTeamSuccess({ team })),
          catchError((err) =>
            of(TournamentActions.addTeamFailure({ error: err.message ?? 'Error al agregar equipo' })),
          ),
        ),
      ),
    ),
  );

  removeTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TournamentActions.removeTeam),
      switchMap(({ tournamentId, teamId }) =>
        this.teamsService.teamsRetrieve(teamId).pipe(
          switchMap((team) =>
            this.teamsService.teamsPartialUpdate(
              teamId,
              team.name,
              (team.tournaments ?? []).filter((id) => id !== tournamentId),
            ),
          ),
          map(() => TournamentActions.removeTeamSuccess({ teamId })),
          catchError((err) =>
            of(TournamentActions.removeTeamFailure({ error: err.message ?? 'Error al eliminar equipo' })),
          ),
        ),
      ),
    ),
  );
}
