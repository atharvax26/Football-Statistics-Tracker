import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { matches, players } from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Society FC" }] }),
  component: AdminPage,
});

const EASE = [0.22, 1, 0.36, 1] as const;

function AdminPage() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [shake, setShake] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "260526") setUnlocked(true);
    else {
      setShake((s) => s + 1);
      setPin("");
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.form
          key={shake}
          initial={{ opacity: 0, y: 16 }}
          animate={
            shake > 0
              ? { opacity: 1, y: 0, x: [0, -12, 12, -8, 8, 0] }
              : { opacity: 1, y: 0 }
          }
          transition={{ duration: shake > 0 ? 0.45 : 0.6, ease: EASE }}
          onSubmit={submit}
          className="w-full max-w-sm bg-card border border-border p-10 text-center"
        >
          <div className="text-[10px] uppercase tracking-[0.5em] text-primary">
            Restricted
          </div>
          <h1 className="font-display text-4xl mt-4">ADMIN ACCESS</h1>
          <p className="text-xs text-muted-foreground mt-2">
            Enter the 6-digit PIN
          </p>
          <input
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            className="mt-8 w-full bg-background border border-border text-center font-display text-4xl tracking-[0.4em] py-4 outline-none focus:border-primary"
            placeholder="——————"
          />
          <button
            type="submit"
            className="mt-6 w-full bg-primary text-primary-foreground py-3 text-xs uppercase tracking-[0.3em] hover:opacity-90"
          >
            Unlock
          </button>
          <div className="mt-6 text-[10px] text-muted-foreground/60">
            Hint (UI demo): 260526
          </div>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="text-[11px] uppercase tracking-[0.5em] text-primary">
            Admin
          </div>
          <h1 className="font-display text-6xl md:text-7xl mt-3">CONTROL ROOM</h1>
        </motion.div>

        <div className="mt-12 grid lg:grid-cols-2 gap-3">
          <Panel title="Players" cta="+ Add player">
            <ul className="divide-y divide-border">
              {players.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span>{p.name}</span>
                  <div className="flex gap-2">
                    <button className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary">
                      Edit
                    </button>
                    <button className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-destructive">
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Matches" cta="+ New match">
            <ul className="divide-y divide-border">
              {matches
                .slice(-6)
                .reverse()
                .map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <div className="font-display text-lg">
                        Game {String(m.matchNumber).padStart(2, "0")}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {new Date(m.date).toLocaleDateString()}
                      </div>
                    </div>
                    <button className="text-[10px] uppercase tracking-[0.3em] border border-border px-3 py-2 hover:border-primary hover:text-primary">
                      Log goal
                    </button>
                  </li>
                ))}
            </ul>
          </Panel>
        </div>
      </main>
    </div>
  );
}

function Panel({
  title,
  cta,
  children,
}: {
  title: string;
  cta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border p-6 top-glow">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display text-2xl tracking-wide">{title}</h2>
        <button className="text-[10px] uppercase tracking-[0.3em] text-primary hover:underline">
          {cta}
        </button>
      </div>
      {children}
    </div>
  );
}
