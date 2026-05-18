import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-games',
  template: `<p>Games works</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesComponent {}
