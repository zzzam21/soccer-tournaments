import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';

import { TeamActions } from '../../store/Team/team.actions';
import { selectTeamList } from '../../store/Team/team.selectors';
import { TournamentActions } from '../../store/Tournament/tournament.actions';
import {
  selectTournamentList,
  selectTournamentLoading,
  selectTournamentError,
  selectSelectedTournament,
  selectTournamentTeams,
  selectTournamentTeamsLoading,
  selectTournamentStandings,
  selectTournamentStandingsLoading,
} from '../../store/Tournament/tournament.selectors';
import { Tournament } from '../../store/Tournament/tournament.models';
import { TournamentCardComponent } from '../../shared/components/tournament-card/tournament-card.component';
import { TournamentFormComponent } from '../../shared/components/tournament-form/tournament-form.component';
import { StandingsTableComponent } from '../../shared/components/standings-table/standings-table.component';
import { TeamManagerComponent } from '../../shared/components/team-manager/team-manager.component';
import { ConfirmDeleteDialog } from '../../shared/components/confirm-delete/confirm-delete.dialog';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrl: './tournaments.component.scss',
  imports: [
    TournamentCardComponent,
    TournamentFormComponent,
    StandingsTableComponent,
    TeamManagerComponent,
    ConfirmDeleteDialog,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentsComponent implements OnInit {
  private store = inject(Store);

  tournaments = toSignal(this.store.select(selectTournamentList), { initialValue: [] });
  loading = toSignal(this.store.select(selectTournamentLoading), { initialValue: false });
  error = toSignal(this.store.select(selectTournamentError), { initialValue: null });
  selectedTournament = toSignal(this.store.select(selectSelectedTournament), { initialValue: null });
  tournamentTeams = toSignal(this.store.select(selectTournamentTeams), { initialValue: [] });
  tournamentTeamsLoading = toSignal(this.store.select(selectTournamentTeamsLoading), { initialValue: false });
  standings = toSignal(this.store.select(selectTournamentStandings), { initialValue: [] });
  standingsLoading = toSignal(this.store.select(selectTournamentStandingsLoading), { initialValue: false });
  allTeams = toSignal(this.store.select(selectTeamList), { initialValue: [] });

  showForm = signal(false);
  showDeleteDialog = signal(false);
  editingTournament = signal<Tournament | null>(null);
  deletingTournament = signal<Tournament | null>(null);
  saving = signal(false);
  deleting = signal(false);

  activeTab = signal<'standings' | 'teams'>('standings');

  ngOnInit(): void {
    this.store.dispatch(TournamentActions.load());
    this.store.dispatch(TeamActions.load());
  }

  trackById(_index: number, item: Tournament): number {
    return item.id;
  }

  selectTournament(t: Tournament): void {
    this.store.dispatch(TournamentActions.select({ id: t.id }));
    this.store.dispatch(TournamentActions.loadTournamentTeams({ tournamentId: t.id }));
    this.store.dispatch(TournamentActions.loadStandings({ tournamentId: t.id }));
    this.activeTab.set('standings');
  }

  clearSelection(): void {
    this.store.dispatch(TournamentActions.select({ id: 0 }));
  }

  openCreateForm(): void {
    this.editingTournament.set(null);
    this.showForm.set(true);
  }

  openEditForm(t: Tournament): void {
    this.editingTournament.set(t);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingTournament.set(null);
  }

  onSaveForm(data: { name: string; city: string; tournament_type: string; status: string; start_date: string; end_date: string }): void {
    const edit = this.editingTournament();
    this.saving.set(true);

    if (edit) {
      this.store.dispatch(TournamentActions.update({ id: edit.id, ...data }));
    } else {
      this.store.dispatch(TournamentActions.create(data));
    }

    setTimeout(() => {
      this.saving.set(false);
      this.closeForm();
    }, 300);
  }

  confirmDelete(t: Tournament): void {
    this.deletingTournament.set(t);
    this.showDeleteDialog.set(true);
  }

  executeDelete(): void {
    const t = this.deletingTournament();
    if (!t) return;
    this.deleting.set(true);
    this.store.dispatch(TournamentActions.delete({ id: t.id }));
    setTimeout(() => {
      this.deleting.set(false);
      this.showDeleteDialog.set(false);
      this.deletingTournament.set(null);
    }, 300);
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false);
    this.deletingTournament.set(null);
  }

  addTeam(teamId: number): void {
    const tournament = this.selectedTournament();
    if (!tournament) return;
    this.store.dispatch(TournamentActions.addTeam({ tournamentId: tournament.id, teamId }));
    setTimeout(() => {
      this.store.dispatch(TournamentActions.loadTournamentTeams({ tournamentId: tournament.id }));
      this.store.dispatch(TournamentActions.loadStandings({ tournamentId: tournament.id }));
    }, 500);
  }

  removeTeam(teamId: number): void {
    const tournament = this.selectedTournament();
    if (!tournament) return;
    this.store.dispatch(TournamentActions.removeTeam({ tournamentId: tournament.id, teamId }));
    setTimeout(() => {
      this.store.dispatch(TournamentActions.loadTournamentTeams({ tournamentId: tournament.id }));
      this.store.dispatch(TournamentActions.loadStandings({ tournamentId: tournament.id }));
    }, 500);
  }
}
