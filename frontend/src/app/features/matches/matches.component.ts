import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';

import { TournamentActions } from '../../store/Tournament/tournament.actions';
import { selectTournamentList } from '../../store/Tournament/tournament.selectors';
import { MatchActions } from '../../store/Match/match.actions';
import {
  selectMatchList,
  selectMatchLoading,
  selectMatchError,
  selectMatchCreating,
  selectMatchGames,
  selectMatchGamesLoading,
} from '../../store/Match/match.selectors';
import { selectTeamList } from '../../store/Team/team.selectors';
import { TeamActions } from '../../store/Team/team.actions';
import { Match } from '../../store/Match/match.models';
import { MatchFormComponent } from '../../shared/components/match-form/match-form.component';
import { ConfirmDeleteDialog } from '../../shared/components/confirm-delete/confirm-delete.dialog';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss',
  imports: [MatchFormComponent, ConfirmDeleteDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchesComponent implements OnInit {
  private store = inject(Store);

  tournaments = toSignal(this.store.select(selectTournamentList), { initialValue: [] });
  allMatches = toSignal(this.store.select(selectMatchList), { initialValue: [] });
  loading = toSignal(this.store.select(selectMatchLoading), { initialValue: false });
  error = toSignal(this.store.select(selectMatchError), { initialValue: null });
  creating = toSignal(this.store.select(selectMatchCreating), { initialValue: false });
  matchGames = toSignal(this.store.select(selectMatchGames), { initialValue: [] });
  gamesLoading = toSignal(this.store.select(selectMatchGamesLoading), { initialValue: false });
  allTeams = toSignal(this.store.select(selectTeamList), { initialValue: [] });

  selectedTournamentId = signal<number | null>(null);
  expandedMatchId = signal<number | null>(null);
  showMatchForm = signal(false);
  editingMatch = signal<Match | null>(null);
  showDeleteDialog = signal(false);
  deletingMatch = signal<Match | null>(null);
  deleting = signal(false);
  gameError = signal<string | null>(null);

  minNewMatchDate = computed(() => {
    const matches = this.filteredMatches();
    if (matches.length === 0) return '';
    const latest = matches.reduce((a, b) => (a.start_date > b.start_date ? a : b));
    const d = new Date(latest.start_date);
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });

  filteredMatches = computed(() => {
    const id = this.selectedTournamentId();
    if (!id) return [];
    return this.allMatches()
      .filter((m) => m.tournament === id)
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  });

  selectedTournamentName = computed(() => {
    const id = this.selectedTournamentId();
    if (!id) return '';
    return this.tournaments().find((t) => t.id === id)?.name ?? '';
  });

  selectedTournamentTeams = computed(() => {
    const id = this.selectedTournamentId();
    if (!id) return [];
    return this.allTeams().filter((t) => t.tournaments?.includes(id));
  });

  ngOnInit(): void {
    this.store.dispatch(TournamentActions.load());
    this.store.dispatch(MatchActions.load());
    this.store.dispatch(TeamActions.load());
  }

  trackById(_index: number, item: Match): number {
    return item.id;
  }

  selectTournament(id: string): void {
    this.selectedTournamentId.set(Number(id));
    this.expandedMatchId.set(null);
  }

  toggleExpand(matchId: number): void {
    if (this.expandedMatchId() === matchId) {
      this.expandedMatchId.set(null);
    } else {
      this.expandedMatchId.set(matchId);
      this.gameError.set(null);
      this.store.dispatch(MatchActions.select({ id: matchId }));
      this.store.dispatch(MatchActions.loadGames({ matchId }));
    }
  }

  openCreateForm(): void {
    this.editingMatch.set(null);
    this.showMatchForm.set(true);
  }

  openEditForm(m: Match): void {
    this.editingMatch.set(m);
    this.showMatchForm.set(true);
  }

  closeForm(): void {
    this.showMatchForm.set(false);
    this.editingMatch.set(null);
  }

  onSaveForm(data: { number: number; start_date: string }): void {
    const tid = this.selectedTournamentId();
    if (!tid) return;

    const edit = this.editingMatch();
    if (edit) {
      this.store.dispatch(MatchActions.update({ id: edit.id, ...data }));
    } else {
      this.store.dispatch(MatchActions.create({ ...data, tournament: tid }));
    }
    this.closeForm();
  }

  confirmDelete(m: Match): void {
    this.deletingMatch.set(m);
    this.showDeleteDialog.set(true);
  }

  executeDelete(): void {
    const m = this.deletingMatch();
    if (!m) return;
    this.deleting.set(true);
    this.store.dispatch(MatchActions.delete({ id: m.id }));
    setTimeout(() => {
      this.deleting.set(false);
      this.showDeleteDialog.set(false);
      this.deletingMatch.set(null);
    }, 300);
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false);
    this.deletingMatch.set(null);
  }

  getGamesForMatch(matchId: number): import('../../../client/models').Game[] {
    return this.matchGames().filter((g) => g.match === matchId);
  }

  addGame(matchId: number, localTeamId: string, visitantTeamId: string, startTime?: string): void {
    const match = this.allMatches().find((m) => m.id === matchId);
    const local = Number(localTeamId);
    const visitant = Number(visitantTeamId);
    if (!match || !localTeamId || !visitantTeamId || local === visitant) return;

    const existingGames = this.getGamesForMatch(matchId);
    const teamInUse = existingGames.some(
      (g) => g.local_team === local || g.visitant_team === local ||
             g.local_team === visitant || g.visitant_team === visitant,
    );
    if (teamInUse) {
      this.gameError.set('Uno de los equipos ya tiene un partido programado en esta jornada');
      return;
    }
    this.gameError.set(null);

    this.store.dispatch(MatchActions.createGame({
      local_goals: 0,
      visitant_goals: 0,
      status: 'Scheduled',
      date: match.start_date,
      start_time: startTime || null,
      match: matchId,
      local_team: local,
      visitant_team: visitant,
    }));
  }

  removeGame(gameId: number, matchId: number): void {
    if (confirm('¿Eliminar este partido?')) {
      this.store.dispatch(MatchActions.deleteGame({ id: gameId, matchId }));
    }
  }

  getTeamName(teamId: number): string {
    return this.allTeams().find((t) => t.id === teamId)?.name ?? '—';
  }
}
