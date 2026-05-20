import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Navbar } from "@/components/Navbar";
import { StatTile } from "@/components/StatTile";
import { getLeaderboard, getPlayerStats, matches, players } from "@/lib/mock-data";

export const Route = createFileRoute("/players/$playerId")({
  loader: ({ params }) => {
    const player = players.find((p) => p.id === params.playerId);
    if (!player) throw notFound();
    return { stats: getPlayerStats(params.playerId) };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.stats.player.name ?? "Player"} · Chaurange FC` },
      {
        name: "description",
        content: `Full stats, charts, and match log for ${
          loaderData?.stats.player.name ?? "this player"
        }.`,
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Player not found.{" "}
      <Link to="/players" className="ml-2 text-primary underline">
        Back to squad
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      {error.message}
    </div>
  ),
  component: PlayerProfile,
});

const EASE = [0.22, 1, 0.36, 1] as const;
const AMBER = "var(--color-primary)";

function PlayerProfile() {
  const { stats } = Route.useLoaderData();
  const board = getLeaderboard();
  const rank = board.findIndex((s) => s.player.id === stats.player.id) + 1;

  const winLossData = [
    { name: "Wins", value: stats.wins, color: "var(--color-primary)" },
    { name: "Draws", value: stats.draws, color: "var(--color-muted-foreground)" },
    {
      name: "Losses",
      value: stats.losses,
      color: "var(--color-destructive)",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-end justify-between flex-wrap gap-6"
        >
          <div>
            <Link
              to="/"
              className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-primary"
            >
              ← Leaderboard
            </Link>
            <div className="mt-3 text-[11px] uppercase tracking-[0.5em] text-primary">
              Rank #{rank}
              {stats.player.nickname && (
                <span className="text-muted-foreground ml-3">
                  · "{stats.player.nickname}"
                </span>
              )}
            </div>
            <h1 className="font-display text-6xl md:text-8xl mt-2 leading-none">
              {stats.player.name.toUpperCase()}
            </h1>
          </div>
          <div
            className={`font-display text-[6rem] md:text-[9rem] leading-none ${
              rank === 1
                ? "text-gold"
                : rank === 2
                  ? "text-silver"
                  : rank === 3
                    ? "text-bronze"
                    : "text-muted-foreground/20"
            }`}
            style={{ textShadow: rank <= 3 ? "0 0 60px currentColor" : "none" }}
          >
            {String(rank).padStart(2, "0")}
          </div>
        </motion.div>

        {/* stat grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile label="Total Goals" value={stats.goals} accent />
          <StatTile label="Matches Played" value={stats.matchesPlayed} />
          <StatTile label="Goals / Match" value={stats.gpm} decimals={2} />
          <StatTile label="Weighted Score" value={stats.weightedScore} decimals={2} accent />
          <StatTile label="Win Rate %" value={stats.winRate} decimals={1} />
          <StatTile label="Wins" value={stats.wins} />
          <StatTile label="Draws" value={stats.draws} />
          <StatTile label="Own Goals" value={stats.ownGoals} />
        </div>

        {/* charts */}
        <div className="mt-12 grid lg:grid-cols-2 gap-3">
          <ChartCard title="Goals per Match" subtitle="Every game, every goal">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.goalsPerMatch}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="matchNumber"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--color-secondary)" }}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="goals"
                  fill={AMBER}
                  radius={[2, 2, 0, 0]}
                  animationDuration={1200}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Form" subtitle="Last 5 matches">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={stats.recentForm}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="matchNumber"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="goals"
                  stroke={AMBER}
                  strokeWidth={2.5}
                  dot={{ fill: AMBER, r: 4 }}
                  animationDuration={1400}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Win / Draw / Loss" subtitle="Career split">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={winLossData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  stroke="var(--color-background)"
                  strokeWidth={2}
                  animationDuration={1200}
                >
                  {winLossData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {winLossData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: d.color }}
                  />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {d.name} {d.value}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Best Game" subtitle="Career highlight">
            {stats.bestGame ? (
              <div className="h-[260px] flex flex-col items-center justify-center">
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Game {stats.bestGame.matchNumber}
                </div>
                <div className="font-display text-[10rem] text-primary leading-none mt-2">
                  {stats.bestGame.goals}
                </div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-2">
                  {new Date(stats.bestGame.date).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
                No goals scored yet
              </div>
            )}
          </ChartCard>
        </div>

        {/* match log */}
        <section className="mt-12">
          <h2 className="font-display text-3xl tracking-wide">MATCH LOG</h2>
          <div className="mt-4 border-t border-border">
            {stats.goalsPerMatch
              .slice()
              .reverse()
              .map((row: { matchNumber: number; goals: number }) => {
                const m = matches.find((x) => x.matchNumber === row.matchNumber)!;
                const playerSquad: "A" | "B" = m.squadA.includes(stats.player.id)
                  ? "A"
                  : "B";
                return (
                  <div
                    key={row.matchNumber}
                    className="grid grid-cols-[60px_1fr_auto_auto] gap-6 items-center px-4 py-4 border-b border-border hover:bg-card transition-colors"
                  >
                    <div className="font-display text-xl text-primary">
                      {String(row.matchNumber).padStart(2, "0")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(m.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      Squad {playerSquad}
                    </div>
                    <div className="text-stat text-2xl w-12 text-right">
                      {row.goals}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      </main>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border p-6 relative top-glow">
      <div className="flex items-baseline justify-between mb-6">
        <h3 className="font-display text-2xl tracking-wide">{title}</h3>
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {subtitle}
        </span>
      </div>
      {children}
    </div>
  );
}
