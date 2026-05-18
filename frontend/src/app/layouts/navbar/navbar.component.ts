import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `<nav>Navbar</nav>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {}
