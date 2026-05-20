import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { getLeaderboard } from "@/lib/mock-data";

export const Route = createFileRoute("/players")({
  head: () => ({
    meta: [
      { title: "Players · Chaurange FC" },
      { name: "description", content: "The Chaurange FC squad registry." },
    ],
  }),
  component: PlayersPage,
});

const EASE = [0.22, 1, 0.36, 1] as const;

function PlayersPage() {
  const stats = getLeaderboard();
  const rankMap = new Map(stats.map((s, i) => [s.player.id, i + 1]));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="text-[11px] uppercase tracking-[0.5em] text-primary">
            Squad
          </div>
          <h1 className="font-display text-6xl md:text-7xl mt-3">THE PLAYERS</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {stats.length} active members
          </p>
        </motion.div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {stats
            .slice()
            .sort((a, b) => a.player.name.localeCompare(b.player.name))
            .map((s, i) => {
              const rank = rankMap.get(s.player.id)!;
              return (
                <motion.div
                  key={s.player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
                >
                  <Link
                    to="/players/$playerId"
                    params={{ playerId: s.player.id }}
                    className="top-glow group block bg-card border border-border hover:border-primary/40 transition-colors p-6 h-full"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                          Rank #{rank}
                        </div>
                        <div className="font-display text-2xl mt-2 tracking-wide group-hover:text-primary transition-colors">
                          {s.player.name}
                        </div>
                        {s.player.nickname && (
                          <div className="text-xs text-muted-foreground italic mt-1">
                            "{s.player.nickname}"
                          </div>
                        )}
                      </div>
                      <div
                        className={`text-stat text-4xl ${
                          rank === 1
                            ? "text-gold"
                            : rank === 2
                              ? "text-silver"
                              : rank === 3
                                ? "text-bronze"
                                : "text-muted-foreground/40"
                        }`}
                      >
                        {String(rank).padStart(2, "0")}
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-border grid grid-cols-3 gap-2">
                      <Stat label="Goals" value={s.goals} />
                      <Stat label="Mp" value={s.matchesPlayed} />
                      <Stat label="Gpm" value={s.gpm.toFixed(2)} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </div>
      <div className="text-stat text-2xl mt-1">{value}</div>
    </div>
  );
}
