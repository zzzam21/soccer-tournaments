import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthActions } from '../../../store/Authentication/authentication.actions';
import { selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../../../store/Authentication/authentication.selectors';
import { showErrorToast, showSuccessToast } from '../../../shared/utils/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private store = inject(Store);

  loading = toSignal(this.store.select(selectAuthLoading), { initialValue: false });
  error = toSignal(this.store.select(selectAuthError), { initialValue: null });
  isAuthenticated = toSignal(this.store.select(selectIsAuthenticated), { initialValue: false });
  showPassword = false;

  constructor() {
    effect(() => {
      const err = this.error();
      if (err) showErrorToast(err);
    });

    effect(() => {
      if (this.isAuthenticated()) showSuccessToast('Inicio de sesión exitoso');
    });
  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  onSubmit(username: string, password: string): void {
    if (!username || !password) return;
    this.store.dispatch(AuthActions.login({ username, password }));
  }
}
