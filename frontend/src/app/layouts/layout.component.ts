import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="dashboard-layout">
      <app-sidebar />
      <div class="dashboard-right">
        <app-topbar />
        <main class="dashboard-main">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
      background-color: var(--bg-body);
    }
    .dashboard-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 260px;
      min-height: 100vh;
    }
    .dashboard-main {
      flex: 1;
      padding: 1.5rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
