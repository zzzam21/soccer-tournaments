import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { PlayerActions } from '../../store/Player/player.actions';
import {
  selectPlayerList,
  selectPlayerLoading,
  selectPlayerError,
  selectPlayerTeams,
  selectPlayerTeamsLoading,
  selectSelectedPlayer,
} from '../../store/Player/player.selectors';
import { Player } from '../../store/Player/player.models';
import { PlayerCardComponent } from './player-card.component';
import { PlayerFormComponent } from './player-form.component';
import { ConfirmDeleteDialog } from './confirm-delete.dialog';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss',
  imports: [FormsModule, PlayerCardComponent, PlayerFormComponent, ConfirmDeleteDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersComponent implements OnInit {
  private store = inject(Store);

  players = toSignal(this.store.select(selectPlayerList), { initialValue: [] });
  loading = toSignal(this.store.select(selectPlayerLoading), { initialValue: false });
  error = toSignal(this.store.select(selectPlayerError), { initialValue: null });
  teams = toSignal(this.store.select(selectPlayerTeams), { initialValue: [] });
  teamsLoading = toSignal(this.store.select(selectPlayerTeamsLoading), { initialValue: false });
  selectedPlayer = toSignal(this.store.select(selectSelectedPlayer), { initialValue: null });

  filterTeamId = signal(0);

  filteredPlayers = computed(() => {
    const list = this.players();
    const filterId = this.filterTeamId();
    if (!filterId) return list;
    return list.filter((p) => p.team === filterId);
  });

  showForm = signal(false);
  showDeleteDialog = signal(false);
  editingPlayer = signal<Player | null>(null);
  deletingPlayer = signal<Player | null>(null);
  saving = signal(false);
  deleting = signal(false);

  teamName = computed(() => {
    const map = new Map(this.teams().map((t) => [t.id, t.name]));
    return map;
  });

  ngOnInit(): void {
    this.store.dispatch(PlayerActions.load());
    this.store.dispatch(PlayerActions.loadTeams());
  }

  trackById(_index: number, item: Player): number {
    return item.id;
  }

  onFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filterTeamId.set(+target.value);
  }

  openCreateForm(): void {
    this.editingPlayer.set(null);
    this.showForm.set(true);
  }

  openEditForm(player: Player): void {
    this.editingPlayer.set(player);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingPlayer.set(null);
  }

  onSaveForm(data: { name: string; team?: number | null; photo?: string }): void {
    const edit = this.editingPlayer();
    this.saving.set(true);

    if (edit) {
      this.store.dispatch(PlayerActions.update({ id: edit.id, name: data.name, team: data.team, photo: data.photo }));
    } else {
      this.store.dispatch(PlayerActions.create(data));
    }

    setTimeout(() => {
      this.saving.set(false);
      this.closeForm();
    }, 300);
  }

  confirmDelete(player: Player): void {
    this.deletingPlayer.set(player);
    this.showDeleteDialog.set(true);
  }

  executeDelete(): void {
    const player = this.deletingPlayer();
    if (!player) return;
    this.deleting.set(true);
    this.store.dispatch(PlayerActions.delete({ id: player.id }));
    setTimeout(() => {
      this.deleting.set(false);
      this.showDeleteDialog.set(false);
      this.deletingPlayer.set(null);
    }, 300);
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false);
    this.deletingPlayer.set(null);
  }
}
