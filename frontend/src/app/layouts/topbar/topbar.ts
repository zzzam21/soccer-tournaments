import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';

import { selectUser } from '../../store/Authentication/authentication.selectors';
import { AuthActions } from '../../store/Authentication/authentication.actions';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  private store = inject(Store);

  user = toSignal(this.store.select(selectUser), { initialValue: null });
  showDropdown = false;

  get userInitial(): string {
    const u = this.user();
    return u?.username ? u.username.charAt(0).toUpperCase() : '?';
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
