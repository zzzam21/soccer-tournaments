import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { TeamActions } from '../../store/Team/team.actions';
import { selectTeamList, selectTeamLoading, selectSelectedTeam, selectTeamTournaments, selectTeamTournamentsLoading, selectTeamError } from '../../store/Team/team.selectors';
import { Team } from '../../store/Team/team.models';
import { TeamCardComponent } from './team-card.component';
import { TeamFormComponent } from './team-form.component';
import { ConfirmDeleteDialog } from './confirm-delete.dialog';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss',
  imports: [FormsModule, TeamCardComponent, TeamFormComponent, ConfirmDeleteDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsComponent implements OnInit {
  private store = inject(Store);

  teams = toSignal(this.store.select(selectTeamList), { initialValue: [] });
  loading = toSignal(this.store.select(selectTeamLoading), { initialValue: false });
  error = toSignal(this.store.select(selectTeamError), { initialValue: null });
  tournaments = toSignal(this.store.select(selectTeamTournaments), { initialValue: [] });
  tournamentsLoading = toSignal(this.store.select(selectTeamTournamentsLoading), { initialValue: false });
  selectedTeam = toSignal(this.store.select(selectSelectedTeam), { initialValue: null });

  filterTournamentId = signal(0);

  filteredTeams = computed(() => {
    const list = this.teams();
    const filterId = this.filterTournamentId();
    if (!filterId) return list;
    return list.filter((t) => t.tournaments?.includes(filterId));
  });

  showForm = signal(false);
  showDeleteDialog = signal(false);
  editingTeam = signal<Team | null>(null);
  deletingTeam = signal<Team | null>(null);
  saving = signal(false);
  deleting = signal(false);

  tournamentNamesMap = computed(() => new Map(this.tournaments().map((t) => [t.id, t.name])));

  ngOnInit(): void {
    this.store.dispatch(TeamActions.load());
    this.store.dispatch(TeamActions.loadTournaments());
  }

  trackById(_index: number, item: Team): number {
    return item.id;
  }

  onFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filterTournamentId.set(+target.value);
  }

  teamTournamentList(team: Team): string {
    const map = this.tournamentNamesMap();
    return (team.tournaments ?? [])
      .map((id) => map.get(id))
      .filter((name): name is string => !!name)
      .join(', ');
  }

  openCreateForm(): void {
    this.editingTeam.set(null);
    this.showForm.set(true);
  }

  openEditForm(team: Team): void {
    this.editingTeam.set(team);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingTeam.set(null);
  }

  onSaveForm(data: { name: string; tournaments?: number[] }): void {
    const edit = this.editingTeam();
    this.saving.set(true);

    if (edit) {
      this.store.dispatch(TeamActions.update({ id: edit.id, ...data }));
    } else {
      this.store.dispatch(TeamActions.create(data));
    }

    setTimeout(() => {
      this.saving.set(false);
      this.closeForm();
    }, 300);
  }

  confirmDelete(team: Team): void {
    this.deletingTeam.set(team);
    this.showDeleteDialog.set(true);
  }

  executeDelete(): void {
    const team = this.deletingTeam();
    if (!team) return;
    this.deleting.set(true);
    this.store.dispatch(TeamActions.delete({ id: team.id }));
    setTimeout(() => {
      this.deleting.set(false);
      this.showDeleteDialog.set(false);
      this.deletingTeam.set(null);
    }, 300);
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false);
    this.deletingTeam.set(null);
  }
}
