import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tournaments',
  template: `<p>Tournaments works</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentsComponent {}
