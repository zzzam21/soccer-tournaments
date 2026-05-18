import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';

import { TournamentActions } from '../../store/Tournament/tournament.actions';
import { TeamActions } from '../../store/Team/team.actions';
import { MatchActions } from '../../store/Match/match.actions';
import { selectTournamentList, selectTournamentLoading } from '../../store/Tournament/tournament.selectors';
import { selectTeamList, selectTeamLoading } from '../../store/Team/team.selectors';
import { selectMatchList, selectMatchLoading } from '../../store/Match/match.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private store = inject(Store);

  tournaments = toSignal(this.store.select(selectTournamentList), { initialValue: [] });
  teams = toSignal(this.store.select(selectTeamList), { initialValue: [] });
  matches = toSignal(this.store.select(selectMatchList), { initialValue: [] });

  tournamentsLoading = toSignal(this.store.select(selectTournamentLoading), { initialValue: false });
  teamsLoading = toSignal(this.store.select(selectTeamLoading), { initialValue: false });
  matchesLoading = toSignal(this.store.select(selectMatchLoading), { initialValue: false });

  get loading(): boolean {
    return this.tournamentsLoading() || this.teamsLoading() || this.matchesLoading();
  }

  ngOnInit(): void {
    this.store.dispatch(TournamentActions.load());
    this.store.dispatch(TeamActions.load());
    this.store.dispatch(MatchActions.load());
  }
}
