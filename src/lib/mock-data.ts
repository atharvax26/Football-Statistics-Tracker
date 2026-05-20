export type Player = { id: string; name: string; nickname?: string };
export type Match = {
  id: string;
  matchNumber: number;
  date: string;
  squadA: string[];
  squadB: string[];
};
export type Goal = {
  id: string;
  matchId: string;
  playerId: string;
  squad: "A" | "B";
  isOwnGoal: boolean;
};

export const players: Player[] = [
  { id: "p1", name: "Rahul Mehta", nickname: "The Maestro" },
  { id: "p2", name: "Arjun Kapoor", nickname: "Lightning" },
  { id: "p3", name: "Vikram Singh", nickname: "The Wall" },
  { id: "p4", name: "Karan Joshi", nickname: "Sniper" },
  { id: "p5", name: "Dev Patel", nickname: "Iceman" },
  { id: "p6", name: "Sahil Bansal", nickname: "Roadrunner" },
  { id: "p7", name: "Nikhil Rao", nickname: "Tank" },
  { id: "p8", name: "Aditya Verma", nickname: "Magician" },
  { id: "p9", name: "Rohan Iyer", nickname: "The Engine" },
  { id: "p10", name: "Manav Shah", nickname: "Shadow" },
];

const ids = players.map((p) => p.id);

function pickSquads(seed: number): [string[], string[]] {
  const shuffled = [...ids].sort(
    (a, b) => Math.sin(seed * 9301 + a.charCodeAt(1)) - Math.sin(seed * 49297 + b.charCodeAt(1))
  );
  return [shuffled.slice(0, 5), shuffled.slice(5, 10)];
}

export const matches: Match[] = Array.from({ length: 15 }).map((_, i) => {
  const [a, b] = pickSquads(i + 1);
  const date = new Date(2026, 0, 5 + i * 6);
  return {
    id: `m${i + 1}`,
    matchNumber: i + 1,
    date: date.toISOString(),
    squadA: a,
    squadB: b,
  };
});

// Deterministic goal generation
export const goals: Goal[] = (() => {
  const out: Goal[] = [];
  let gid = 1;
  matches.forEach((m, mi) => {
    const totalGoals = 4 + ((mi * 3) % 5); // 4-8 goals per match
    for (let g = 0; g < totalGoals; g++) {
      const squad: "A" | "B" = (mi + g) % 2 === 0 ? "A" : "B";
      const pool = squad === "A" ? m.squadA : m.squadB;
      // bias toward earlier players in list
      const idx = Math.floor((Math.sin(mi * 13 + g * 7) + 1) * 0.5 * pool.length) % pool.length;
      const playerId = pool[idx];
      const isOwnGoal = (mi + g) % 17 === 0;
      out.push({
        id: `g${gid++}`,
        matchId: m.id,
        playerId,
        squad,
        isOwnGoal,
      });
    }
  });
  return out;
})();

// ---- stats ----

export function matchScore(matchId: string): { a: number; b: number } {
  let a = 0,
    b = 0;
  goals.forEach((g) => {
    if (g.matchId !== matchId || g.isOwnGoal) return;
    if (g.squad === "A") a++;
    else b++;
  });
  return { a, b };
}

export function matchResult(matchId: string): "A" | "B" | "DRAW" {
  const { a, b } = matchScore(matchId);
  if (a > b) return "A";
  if (b > a) return "B";
  return "DRAW";
}

export type PlayerStats = {
  player: Player;
  goals: number;
  ownGoals: number;
  matchesPlayed: number;
  gpm: number;
  weightedScore: number;
  winRate: number;
  wins: number;
  losses: number;
  draws: number;
  bestGame: { matchNumber: number; date: string; goals: number } | null;
  goalsPerMatch: { matchNumber: number; goals: number }[];
  recentForm: { matchNumber: number; goals: number }[];
};

export function getPlayerStats(playerId: string): PlayerStats {
  const player = players.find((p) => p.id === playerId)!;
  const playerGoals = goals.filter((g) => g.playerId === playerId && !g.isOwnGoal);
  const ownGoals = goals.filter((g) => g.playerId === playerId && g.isOwnGoal).length;

  const playedMatches = matches.filter(
    (m) => m.squadA.includes(playerId) || m.squadB.includes(playerId)
  );

  const goalsPerMatch = playedMatches.map((m) => ({
    matchNumber: m.matchNumber,
    goals: playerGoals.filter((g) => g.matchId === m.id).length,
  }));

  let wins = 0,
    losses = 0,
    draws = 0;
  playedMatches.forEach((m) => {
    const playerSquad: "A" | "B" = m.squadA.includes(playerId) ? "A" : "B";
    const res = matchResult(m.id);
    if (res === "DRAW") draws++;
    else if (res === playerSquad) wins++;
    else losses++;
  });

  const matchesPlayed = playedMatches.length;
  const totalGoals = playerGoals.length;
  const gpm = matchesPlayed ? totalGoals / matchesPlayed : 0;
  const weightedScore = gpm * Math.log(matchesPlayed + 1);
  const winRate = matchesPlayed ? (wins / matchesPlayed) * 100 : 0;

  const best = goalsPerMatch.reduce(
    (acc, cur) => (cur.goals > (acc?.goals ?? -1) ? cur : acc),
    null as null | { matchNumber: number; goals: number }
  );
  const bestGame =
    best && best.goals > 0
      ? {
          matchNumber: best.matchNumber,
          date:
            matches.find((m) => m.matchNumber === best.matchNumber)?.date ??
            new Date().toISOString(),
          goals: best.goals,
        }
      : null;

  return {
    player,
    goals: totalGoals,
    ownGoals,
    matchesPlayed,
    gpm,
    weightedScore,
    winRate,
    wins,
    losses,
    draws,
    bestGame,
    goalsPerMatch,
    recentForm: goalsPerMatch.slice(-5),
  };
}

export function getLeaderboard(): PlayerStats[] {
  return players
    .map((p) => getPlayerStats(p.id))
    .sort((a, b) => b.weightedScore - a.weightedScore);
}

export function getPlayerGoalsInMatch(matchId: string, playerId: string): number {
  return goals.filter((g) => g.matchId === matchId && g.playerId === playerId && !g.isOwnGoal)
    .length;
}

export function getPlayerOwnGoalsInMatch(matchId: string, playerId: string): number {
  return goals.filter((g) => g.matchId === matchId && g.playerId === playerId && g.isOwnGoal)
    .length;
}
