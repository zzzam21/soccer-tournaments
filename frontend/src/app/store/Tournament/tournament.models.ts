import { Team } from '../Team/team.models';

export interface Tournament {
  id: number;
  name: string;
  city: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
}

export interface TeamStanding {
  teamId: number;
  teamName: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
}

export interface TournamentState {
  list: Tournament[];
  selected: Tournament | null;
  loading: boolean;
  error: string | null;
  tournamentTeams: Team[];
  tournamentTeamsLoading: boolean;
  standings: TeamStanding[];
  standingsLoading: boolean;
}

export const initialTournamentState: TournamentState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
  tournamentTeams: [],
  tournamentTeamsLoading: false,
  standings: [],
  standingsLoading: false,
};
