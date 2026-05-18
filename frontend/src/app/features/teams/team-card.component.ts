import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Team } from '../../store/Team/team.models';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCardComponent {
  team = input.required<Team>();
  tournamentNames = input<string>('');
  onEdit = output<Team>();
  onDelete = output<Team>();
}
