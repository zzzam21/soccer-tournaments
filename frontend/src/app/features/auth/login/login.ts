import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';

import { AuthActions } from '../../../store/Authentication/authentication.actions';
import { selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../../../store/Authentication/authentication.selectors';

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
      if (err) {
        void Swal.fire({
          icon: 'error',
          text: err,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          background: '#111827',
          color: '#F8FAFC',
          iconColor: '#EF4444',
        });
      }
    });

    effect(() => {
      if (this.isAuthenticated()) {
        void Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          background: '#111827',
          color: '#F8FAFC',
          iconColor: '#22C55E',
          confirmButtonColor: '#22C55E',
        });
      }
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
