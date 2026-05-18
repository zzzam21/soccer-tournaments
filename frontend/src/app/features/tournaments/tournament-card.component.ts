import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Tournament } from '../../store/Tournament/tournament.models';

@Component({
  selector: 'app-tournament-card',
  templateUrl: './tournament-card.component.html',
  styleUrl: './tournament-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentCardComponent {
  tournament = input.required<Tournament>();
  selected = input(false);
  onSelect = output<Tournament>();
  onEdit = output<Tournament>();
  onDelete = output<Tournament>();

  statusClass: Record<string, string> = {
    Ongoing: 'badge-live',
    Completed: 'badge-finished',
    Upcoming: 'badge-upcoming',
  };
}
