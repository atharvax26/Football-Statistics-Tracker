import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { IntroSequence } from "@/components/IntroSequence";
import { getLeaderboard } from "@/lib/mock-data";
import heroBlue from "@/assets/hero-blue.jpg";
import heroRed from "@/assets/hero-red.jpg";
import heroYellow from "@/assets/hero-yellow.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Leaderboard · Chaurange FC" },
      {
        name: "description",
        content:
          "Live ranked leaderboard of every Chaurange FC player, sorted by weighted score.",
      },
    ],
  }),
  component: LeaderboardPage,
});

const EASE = [0.22, 1, 0.36, 1] as const;

function LeaderboardPage() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("society-intro")) setIntroDone(true);
  }, []);

  const finishIntro = () => {
    sessionStorage.setItem("society-intro", "1");
    setIntroDone(true);
  };

  const board = getLeaderboard();

  return (
    <>
      {!introDone && <IntroSequence onDone={finishIntro} />}
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 pb-24">
          {/* hero */}
          <section className="relative pt-16 pb-12 overflow-hidden">
            <div className="grid grid-cols-3 gap-2 absolute inset-x-0 top-0 h-[360px] -z-0 opacity-30">
              {[heroBlue, heroRed, heroYellow].map((src, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden"
                  style={{
                    maskImage:
                      "linear-gradient(180deg, black 0%, black 40%, transparent 100%)",
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    aria-hidden
                    className="w-full h-full object-cover"
                    style={{ filter: "grayscale(0.6) brightness(0.55)" }}
                  />
                </div>
              ))}
            </div>
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: introDone ? 0 : 0.1 }}
                className="text-[11px] uppercase tracking-[0.5em] text-primary"
              >
                Season I · 2026
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
                className="font-display text-6xl md:text-8xl mt-3 leading-none"
              >
                THE LEADERBOARD
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="mt-5 max-w-xl text-sm text-muted-foreground leading-relaxed"
              >
                Ranked by weighted score — goals per match scaled by consistency.
                Inspired by the greats. Played by the squad.
              </motion.p>
            </div>
          </section>

          {/* table */}
          <section className="relative">
            <div className="grid grid-cols-[60px_1fr_60px_60px_60px_80px] md:grid-cols-[80px_1fr_80px_80px_80px_100px] gap-4 px-5 py-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground border-b border-border">
              <div>Rank</div>
              <div>Player</div>
              <div className="text-right">Goals</div>
              <div className="text-right">Mp</div>
              <div className="text-right">Gpm</div>
              <div className="text-right">Score</div>
            </div>

            <ul>
              {board.map((row, i) => {
                const rank = i + 1;
                const medal =
                  rank === 1
                    ? "text-gold"
                    : rank === 2
                      ? "text-silver"
                      : rank === 3
                        ? "text-bronze"
                        : "text-muted-foreground";
                return (
                  <motion.li
                    key={row.player.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: EASE,
                      delay: 0.4 + (board.length - i) * 0.05,
                    }}
                  >
                    <Link
                      to="/players/$playerId"
                      params={{ playerId: row.player.id }}
                      className="top-glow group grid grid-cols-[60px_1fr_60px_60px_60px_80px] md:grid-cols-[80px_1fr_80px_80px_80px_100px] gap-4 items-center px-5 py-5 border-b border-border bg-card hover:bg-secondary/40 transition-colors relative"
                    >
                      <div className={`font-display text-3xl md:text-4xl ${medal}`}>
                        {String(rank).padStart(2, "0")}
                      </div>
                      <div className="min-w-0">
                        <div className="font-display text-xl md:text-2xl tracking-wide truncate group-hover:text-primary transition-colors">
                          {row.player.name}
                        </div>
                        {row.player.nickname && (
                          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-0.5">
                            {row.player.nickname}
                          </div>
                        )}
                      </div>
                      <div className="text-stat text-2xl text-right">{row.goals}</div>
                      <div className="text-stat text-xl text-right text-muted-foreground">
                        {row.matchesPlayed}
                      </div>
                      <div className="text-stat text-xl text-right text-muted-foreground">
                        {row.gpm.toFixed(2)}
                      </div>
                      <div className="text-stat text-2xl text-right text-primary">
                        {row.weightedScore.toFixed(2)}
                      </div>
                      {rank === 1 && (
                        <span
                          className="absolute inset-y-0 left-0 w-[2px] bg-primary"
                          style={{ boxShadow: "0 0 20px var(--color-primary)" }}
                        />
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </section>
        </main>
      </div>
    </>
  );
}
