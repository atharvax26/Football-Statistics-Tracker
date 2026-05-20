import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";

const links = [
  { to: "/", label: "Leaderboard" },
  { to: "/matches", label: "Matches" },
  { to: "/players", label: "Players" },
] as const;

export function Navbar() {
  const loc = useLocation();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="w-7 h-7 rounded-sm bg-primary flex items-center justify-center text-primary-foreground font-display text-lg leading-none pt-0.5">
            S
          </span>
          <span className="font-display text-xl tracking-[0.18em] group-hover:text-primary transition-colors">
            CHAURANGE FC
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active =
              l.to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className="relative px-4 py-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className={active ? "text-foreground" : ""}>{l.label}</span>
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-3 right-3 -bottom-px h-px bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
