import { ChangeDetectionStrategy, Component, computed, HostListener, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Team } from '../../store/Team/team.models';

@Component({
  selector: 'app-team-manager',
  templateUrl: './team-manager.component.html',
  styleUrl: './team-manager.component.scss',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamManagerComponent {
  tournamentTeams = input<Team[]>([]);
  allTeams = input<Team[]>([]);
  loading = input(false);

  onAdd = output<number>();
  onRemove = output<number>();

  searchQuery = signal('');
  showResults = signal(false);

  tournamentTeamIds = computed(() => new Set(this.tournamentTeams().map((t) => t.id)));

  availableTeams = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const excluded = this.tournamentTeamIds();
    return this.allTeams().filter((t) => {
      if (excluded.has(t.id)) return false;
      if (!query) return true;
      return t.name.toLowerCase().includes(query);
    });
  });

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showResults.set(false);
  }

  onInputFocus(): void {
    this.showResults.set(true);
  }

  selectTeam(teamId: number): void {
    this.onAdd.emit(teamId);
    this.searchQuery.set('');
    this.showResults.set(false);
  }

  removeTeam(teamId: number): void {
    this.onRemove.emit(teamId);
  }
}
