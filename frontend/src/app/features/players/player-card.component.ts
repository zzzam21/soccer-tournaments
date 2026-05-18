import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Player } from '../../store/Player/player.models';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerCardComponent {
  player = input.required<Player>();
  teamName = input<string>('');
  onEdit = output<Player>();
  onDelete = output<Player>();

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}

