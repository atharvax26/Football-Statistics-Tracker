import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  matches,
  matchScore,
  matchResult,
  players,
  getPlayerGoalsInMatch,
  getPlayerOwnGoalsInMatch,
} from "@/lib/mock-data";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { title: "Match History · Chaurange FC" },
      {
        name: "description",
        content:
          "Every Chaurange FC match — squads, scores, goal scorers and own goals.",
      },
    ],
  }),
  component: MatchesPage,
});

const EASE = [0.22, 1, 0.36, 1] as const;

function MatchesPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const sorted = [...matches].sort((a, b) => b.matchNumber - a.matchNumber);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="text-[11px] uppercase tracking-[0.5em] text-primary">
            Archive
          </div>
          <h1 className="font-display text-6xl md:text-7xl mt-3">MATCH HISTORY</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {matches.length} matches played · tap any card to expand
          </p>
        </motion.div>

        <ul className="mt-12 space-y-3">
          {sorted.map((m, i) => {
            const { a, b } = matchScore(m.id);
            const result = matchResult(m.id);
            const open = openId === m.id;
            return (
              <motion.li
                key={m.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
              >
                <button
                  onClick={() => setOpenId(open ? null : m.id)}
                  className="top-glow w-full text-left bg-card border border-border hover:border-primary/40 transition-colors"
                >
                  <div className="grid grid-cols-[80px_1fr_auto] md:grid-cols-[100px_1fr_auto] gap-6 items-center px-6 py-5">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        Game
                      </div>
                      <div className="font-display text-3xl text-primary">
                        {String(m.matchNumber).padStart(2, "0")}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 md:gap-8">
                      <div className="flex items-center gap-3">
                        <span className="text-stat text-4xl">{a}</span>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                          Squad A
                        </span>
                      </div>
                      <span className="text-muted-foreground">vs</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                          Squad B
                        </span>
                        <span className="text-stat text-4xl">{b}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        {new Date(m.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "2-digit",
                        })}
                      </div>
                      <div
                        className={`mt-1 text-[10px] uppercase tracking-[0.3em] ${
                          result === "DRAW" ? "text-muted-foreground" : "text-primary"
                        }`}
                      >
                        {result === "DRAW"
                          ? "Draw"
                          : `Squad ${result} Win`}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden border-t border-border"
                      >
                        <div className="grid md:grid-cols-2 gap-px bg-border">
                          {(["A", "B"] as const).map((sq) => {
                            const squad = sq === "A" ? m.squadA : m.squadB;
                            return (
                              <div key={sq} className="bg-card p-6">
                                <div className="flex items-baseline justify-between mb-4">
                                  <div className="font-display text-xl tracking-wide">
                                    Squad {sq}
                                  </div>
                                  <div className="text-stat text-3xl text-primary">
                                    {sq === "A" ? a : b}
                                  </div>
                                </div>
                                <ul className="space-y-2">
                                  {squad.map((pid) => {
                                    const p = players.find((x) => x.id === pid)!;
                                    const g = getPlayerGoalsInMatch(m.id, pid);
                                    const og = getPlayerOwnGoalsInMatch(m.id, pid);
                                    return (
                                      <li
                                        key={pid}
                                        className="flex items-center justify-between text-sm py-2 border-b border-border/50 last:border-0"
                                      >
                                        <span>{p.name}</span>
                                        <span className="flex items-center gap-2">
                                          {g > 0 && (
                                            <span className="text-stat text-primary text-lg">
                                              {"●".repeat(g)}
                                            </span>
                                          )}
                                          {og > 0 && (
                                            <span className="text-stat text-destructive text-lg">
                                              {"○".repeat(og)} OG
                                            </span>
                                          )}
                                          {g === 0 && og === 0 && (
                                            <span className="text-muted-foreground text-xs">
                                              —
                                            </span>
                                          )}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
