import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';

import { NavbarComponent } from '../../layouts/navbar/navbar.component';
import { FooterComponent } from '../../layouts/footer/footer.component';
import { CountUpComponent } from '../../shared/components/count-up/count-up.component';
import { StatsActions } from '../../store/Stats/stats.actions';
import { selectStatsData, selectStatsLoading } from '../../store/Stats/stats.selectors';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  imports: [RouterLink, NavbarComponent, FooterComponent, CountUpComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing implements OnInit {
  private store = inject(Store);

  stats = toSignal(this.store.select(selectStatsData), { initialValue: null });
  loading = toSignal(this.store.select(selectStatsLoading), { initialValue: false });

  ngOnInit(): void {
    this.store.dispatch(StatsActions.load());
  }
}
