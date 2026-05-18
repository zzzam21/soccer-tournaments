import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthActions } from '../../../store/Authentication/authentication.actions';
import { selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../../../store/Authentication/authentication.selectors';
import { showErrorToast, showSuccessToast } from '../../../shared/utils/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register implements OnInit {
  private store = inject(Store);

  loading = toSignal(this.store.select(selectAuthLoading), { initialValue: false });
  error = toSignal(this.store.select(selectAuthError), { initialValue: null });
  isAuthenticated = toSignal(this.store.select(selectIsAuthenticated), { initialValue: false });

  showPassword = false;
  showConfirmPassword = false;

  constructor() {
    effect(() => {
      const err = this.error();
      if (err) showErrorToast(err);
    });

    effect(() => {
      if (this.isAuthenticated()) showSuccessToast('Cuenta creada exitosamente');
    });
  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  passwordsMatch(password: string, confirm: string): boolean {
    return password === confirm;
  }

  onSubmit(
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): void {
    if (!username || !email || !password || !confirmPassword) return;
    if (!this.passwordsMatch(password, confirmPassword)) {
      showErrorToast('Las contraseñas no coinciden', 3000);
      return;
    }
    this.store.dispatch(
      AuthActions.register({
        username,
        email,
        password,
        confirm_password: confirmPassword,
      }),
    );
  }
}
