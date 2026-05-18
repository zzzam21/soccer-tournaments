import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-players',
  template: `<p>Players works</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersComponent {}
