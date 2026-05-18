import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TeamStanding } from '../../store/Tournament/tournament.models';

@Component({
  selector: 'app-standings-table',
  templateUrl: './standings-table.component.html',
  styleUrl: './standings-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandingsTableComponent {
  standings = input<TeamStanding[]>([]);
  loading = input(false);

  positionLabel(index: number): string {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  }

  positionClass(index: number): string {
    if (index === 0) return 'pos-gold';
    if (index === 1) return 'pos-silver';
    if (index === 2) return 'pos-bronze';
    return '';
  }
}
