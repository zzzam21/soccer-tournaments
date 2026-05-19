import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';

import { TournamentActions } from '../../store/Tournament/tournament.actions';
import { selectTournamentList } from '../../store/Tournament/tournament.selectors';
import { selectTeamList } from '../../store/Team/team.selectors';
import { TeamActions } from '../../store/Team/team.actions';
import { MatchActions } from '../../store/Match/match.actions';
import { selectMatchList } from '../../store/Match/match.selectors';
import { selectPlayerList } from '../../store/Player/player.selectors';
import { PlayerActions } from '../../store/Player/player.actions';
import { GameActions } from '../../store/Game/game.actions';
import {
  selectGameList,
  selectGameLoading,
  selectGameEvents,
  selectGameEventsLoading,
  selectGameUpdating,
} from '../../store/Game/game.selectors';
import type { Game } from '../../../client/models';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesComponent implements OnInit {
  private store = inject(Store);

  tournaments = toSignal(this.store.select(selectTournamentList), { initialValue: [] });
  allMatches = toSignal(this.store.select(selectMatchList), { initialValue: [] });
  allGames = toSignal(this.store.select(selectGameList), { initialValue: [] });
  loading = toSignal(this.store.select(selectGameLoading), { initialValue: false });
  events = toSignal(this.store.select(selectGameEvents), { initialValue: [] });
  eventsLoading = toSignal(this.store.select(selectGameEventsLoading), { initialValue: false });
  updating = toSignal(this.store.select(selectGameUpdating), { initialValue: false });
  allTeams = toSignal(this.store.select(selectTeamList), { initialValue: [] });
  allPlayers = toSignal(this.store.select(selectPlayerList), { initialValue: [] });

  selectedTournamentId = signal<number | null>(null);
  selectedMatchId = signal<number | null>(null);
  expandedGameId = signal<number | null>(null);

  tournamentMatches = computed(() => {
    const tid = this.selectedTournamentId();
    if (!tid) return [];
    return this.allMatches()
      .filter((m) => m.tournament === tid)
      .sort((a, b) => a.number - b.number);
  });

  filteredGames = computed(() => {
    const tid = this.selectedTournamentId();
    const mid = this.selectedMatchId();
    if (!tid) return [];

    const matchIds = mid
      ? [mid]
      : this.allMatches().filter((m) => m.tournament === tid).map((m) => m.id);

    return this.allGames()
      .filter((g) => matchIds.includes(g.match))
      .sort((a, b) => {
        const dateCmp = a.date.localeCompare(b.date);
        if (dateCmp !== 0) return dateCmp;
        return (a.start_time ?? '').localeCompare(b.start_time ?? '');
      });
  });

  expandedGame = computed(() => {
    const id = this.expandedGameId();
    if (!id) return null;
    return this.allGames().find((g) => g.id === id) ?? null;
  });

  elapsedMinutes = computed(() => {
    const game = this.expandedGame();
    if (!game || game.status !== 'Ongoing' || !game.start_time) return 0;
    const [h, m] = game.start_time.split(':').map(Number);
    const start = new Date();
    start.setHours(h, m, 0, 0);
    const diff = Math.floor((Date.now() - start.getTime()) / 60000);
    return Math.min(Math.max(diff, 0), 90);
  });

  elapsedMinutesStr = computed(() => this.elapsedMinutes().toString());

  todayStr = computed(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });

  canStartGame(game: Game): boolean {
    return game.date === this.todayStr();
  }

  gameEvents = computed(() => {
    const id = this.expandedGameId();
    if (!id) return [];
    return this.events().filter((e) => e.game === id).sort((a, b) => a.minute - b.minute);
  });

  ngOnInit(): void {
    this.store.dispatch(TournamentActions.load());
    this.store.dispatch(MatchActions.load());
    this.store.dispatch(GameActions.load());
    this.store.dispatch(TeamActions.load());
    this.store.dispatch(PlayerActions.load());
  }

  selectTournament(id: string): void {
    this.selectedTournamentId.set(Number(id));
    this.selectedMatchId.set(null);
    this.expandedGameId.set(null);
  }

  selectMatch(id: string): void {
    this.selectedMatchId.set(id ? Number(id) : null);
    this.expandedGameId.set(null);
  }

  toggleExpand(gameId: number): void {
    if (this.expandedGameId() === gameId) {
      this.expandedGameId.set(null);
    } else {
      this.expandedGameId.set(gameId);
      this.store.dispatch(GameActions.loadEvents({ gameId }));
    }
  }

  getTeamName(teamId: number): string {
    return this.allTeams().find((t) => t.id === teamId)?.name ?? '—';
  }

  getMatchNumber(matchId: number): string {
    const m = this.allMatches().find((x) => x.id === matchId);
    return m ? `Jornada ${m.number}` : '—';
  }

  startGame(game: Game): void {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    this.store.dispatch(GameActions.updateTime({ id: game.id, start_time: time }));
    this.store.dispatch(GameActions.updateStatus({ id: game.id, status: 'Ongoing' }));
  }

  halfTime(game: Game): void {
    this.store.dispatch(GameActions.updateStatus({ id: game.id, status: 'HalfTime' }));
  }

  secondHalf(game: Game): void {
    this.store.dispatch(GameActions.updateStatus({ id: game.id, status: 'Ongoing' }));
  }

  finishGame(game: Game): void {
    this.store.dispatch(GameActions.updateStatus({ id: game.id, status: 'Finished' }));
  }

  addEvent(typeEvent: string, minute: string, playerId: string): void {
    const game = this.expandedGame();
    if (!game || !typeEvent || !playerId) return;

    this.store.dispatch(GameActions.createEvent({
      typeEvent,
      minute: Number(minute),
      game: game.id,
      player: Number(playerId),
    }));
  }

  removeEvent(eventId: number, gameId: number): void {
    if (confirm('¿Eliminar este evento?')) {
      this.store.dispatch(GameActions.deleteEvent({ id: eventId, gameId }));
    }
  }

  getPlayersByTeam(game: Game): { id: number; name: string }[] {
    const teamIds = [game.local_team, game.visitant_team];
    return this.allPlayers()
      .filter((p) => p.team && teamIds.includes(p.team))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  eventIcon(type: string): string {
    switch (type) {
      case 'Goal': return '⚽';
      case 'Yellow Card': return '🟨';
      case 'Red Card': return '🟥';
      default: return '●';
    }
  }

  trackById(_index: number, item: Game): number {
    return item.id;
  }
}
