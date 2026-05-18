import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';

import { NavbarComponent } from '../../layouts/navbar/navbar.component';
import { FooterComponent } from '../../layouts/footer/footer.component';
import { CountUpComponent } from '../../shared/components/count-up/count-up.component';
import { TournamentsService } from '../../../client/services/tournaments.service';
import { UtilsService } from '../../../client/services/utils.service';
import type { Tournament } from '../../../client/models';
import { StatsActions } from '../../store/Stats/stats.actions';
import { selectStatsData, selectStatsLoading } from '../../store/Stats/stats.selectors';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  imports: [FormsModule, RouterLink, NavbarComponent, FooterComponent, CountUpComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing implements OnInit {
  private store = inject(Store);
  private tournamentsService = inject(TournamentsService);
  private utilsService = inject(UtilsService);

  stats = toSignal(this.store.select(selectStatsData), { initialValue: null });
  loading = toSignal(this.store.select(selectStatsLoading), { initialValue: false });
  tournaments = signal<Tournament[]>([]);
  tournamentsLoading = signal(true);

  contactSending = signal(false);
  contactSent = signal(false);
  contactError = signal<string | null>(null);

  ngOnInit(): void {
    this.store.dispatch(StatsActions.load());
    this.tournamentsService.tournamentsList().subscribe({
      next: (list) => {
        this.tournaments.set(list);
        this.tournamentsLoading.set(false);
      },
      error: () => this.tournamentsLoading.set(false),
    });
  }

  sendContact(name: string, email: string, subject: string, message: string): void {
    this.contactSending.set(true);
    this.contactSent.set(false);
    this.contactError.set(null);

    this.utilsService.utilsContactCreate(name, email, subject, message).subscribe({
      next: () => {
        this.contactSending.set(false);
        this.contactSent.set(true);
      },
      error: (err) => {
        this.contactSending.set(false);
        this.contactError.set(err.message ?? 'Error al enviar el mensaje');
      },
    });
  }
}
