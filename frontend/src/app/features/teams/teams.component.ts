import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-teams',
  template: `<p>Teams works</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsComponent {}
