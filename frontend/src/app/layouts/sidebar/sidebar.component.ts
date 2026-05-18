import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  template: `<aside>Sidebar</aside>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {}
