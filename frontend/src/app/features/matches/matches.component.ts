import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-matches',
  template: `<p>Matches works</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchesComponent {}
