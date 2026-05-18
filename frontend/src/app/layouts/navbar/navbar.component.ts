import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';

import { selectIsAuthenticated, selectUser } from '../../store/Authentication/authentication.selectors';
import { AuthActions } from '../../store/Authentication/authentication.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private store = inject(Store);

  isAuthenticated = toSignal(this.store.select(selectIsAuthenticated), { initialValue: false });
  user = toSignal(this.store.select(selectUser), { initialValue: null });

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
