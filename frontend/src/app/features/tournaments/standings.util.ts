import { TeamStanding } from '../../store/Tournament/tournament.models';
import type { Team } from '../../../client/models';
import type { Game } from '../../../client/models';

export function computeStandings(teams: Team[], games: Game[]): TeamStanding[] {
  const standingsMap = new Map<number, TeamStanding>();

  for (const team of teams) {
    standingsMap.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      pj: 0,
      pg: 0,
      pe: 0,
      pp: 0,
      gf: 0,
      gc: 0,
      dg: 0,
      pts: 0,
    });
  }

  for (const game of games) {
    const local = standingsMap.get(game.local_team);
    const visitant = standingsMap.get(game.visitant_team);
    if (!local || !visitant) continue;

    local.pj++;
    visitant.pj++;

    local.gf += game.local_goals;
    local.gc += game.visitant_goals;
    visitant.gf += game.visitant_goals;
    visitant.gc += game.local_goals;

    if (game.local_goals > game.visitant_goals) {
      local.pg++;
      visitant.pp++;
    } else if (game.local_goals < game.visitant_goals) {
      visitant.pg++;
      local.pp++;
    } else {
      local.pe++;
      visitant.pe++;
    }
  }

  for (const standing of standingsMap.values()) {
    standing.dg = standing.gf - standing.gc;
    standing.pts = standing.pg * 3 + standing.pe;
  }

  return Array.from(standingsMap.values()).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.dg !== a.dg) return b.dg - a.dg;
    return b.gf - a.gf;
  });
}
