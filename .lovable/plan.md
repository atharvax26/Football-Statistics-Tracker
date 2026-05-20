# Society Football Tracker — UI Build Plan

A frontend-only build of the spec. No Firebase, no admin auth logic — everything runs on mock data so the UI can be experienced end-to-end. The focus is a premium "private ESPN" look with a cinematic, professional intro animation.

## Design language

- **Palette (locked from spec):** `#0D0D0D` base, `#1A1A1A` cards, `#2C2C2C` borders, `#F5A623` amber accent, `#C0392B` danger, `#F0EDE8` text, `#888` muted. Wired into `src/styles.css` as oklch tokens + a `--gradient-glow` and `--shadow-amber` for hero treatments.
- **Typography:** Bebas Neue for headings + stat numbers, Inter for body. Loaded via Google Fonts in `__root.tsx`.
- **Motion:** Framer Motion across the app. Restrained, sport-broadcast feel — no decorative fluff.

## Intro animation (professional, not gimmicky)

Replaces the spec's "football explodes" idea with something that feels like a Champions League broadcast intro:

1. Black screen, faint amber vignette pulses in (200ms).
2. Thin amber line sweeps horizontally across center (400ms, custom easing).
3. Title **"SOCIETY FC"** assembles letter-by-letter with a subtle blur-to-focus + slight y-translate (Bebas Neue, tracked wide).
4. Subtitle "EST. 2026 · PRIVATE LEAGUE" fades up underneath.
5. A hero collage of Messi / Neymar / Ronaldo silhouettes slides in from the sides with parallax depth, dimmed behind the title.
6. Whole intro lifts up and fades, revealing the leaderboard which staggers in (rank #10 → #1, 60ms apart, #1 lands with an amber glow pulse).

Total runtime ~2.6s. Skippable on click/scroll. Uses `AnimatePresence` + `motion` with cubic-bezier `[0.22, 1, 0.36, 1]` for that broadcast-grade ease-out.

## Pages & routes

TanStack Start file routes:

- `src/routes/index.tsx` — **Leaderboard** (homepage, intro plays once per session via sessionStorage).
- `src/routes/matches.tsx` — **Match History** with accordion-expand detail.
- `src/routes/players.tsx` — **Players** grid.
- `src/routes/players.$playerId.tsx` — **Player Profile** with charts.
- `src/routes/admin.tsx` — **Admin** view (PIN screen + dashboard, UI only — no real auth, buttons are visual).

Persistent top nav with amber underline on active route.

## Components

- `IntroSequence.tsx` — the cinematic intro.
- `Navbar.tsx` — sticky top nav.
- `LeaderboardRow.tsx` — rank badge (gold/silver/bronze for top 3), name, goals, matches, GPM, weighted score, hover amber top-border glow.
- `MatchCard.tsx` — collapsed + expanded states, smooth height animation.
- `PlayerCard.tsx` — registry grid card.
- `StatTile.tsx` — count-up animated number (uses `useMotionValue` + `animate`).
- `Charts/`: `GoalsPerMatchBar.tsx`, `FormLine.tsx`, `WinRateDonut.tsx` — Recharts with left-to-right draw-in.
- `HeroCollage.tsx` — Messi/Neymar/Ronaldo imagery for the intro + leaderboard hero band.

## Imagery

Generate three portrait-style hero images (stylized, dramatic stadium lighting, not photoreal lookalikes — to stay safe) representing "the GOAT trio" inspiration: one Messi-coded (light blue/white), one Ronaldo-coded (red/black), one Neymar-coded (yellow/green). Used in:
- Intro collage (parallax slide-in).
- Leaderboard hero band above the table ("INSPIRED BY THE GREATS").
- Subtle background watermarks on the empty-state of Player Profile when no avatar exists.

Saved to `src/assets/` and imported as ES6 modules.

## Mock data

`src/lib/mock-data.ts` exports 10 players, 15 matches, ~80 goal events. Stats (GPM, weighted score, win rate, form, best game) are computed on the fly with the formulas from the spec so the UI feels real.

## Out of scope (explicit)

- No Firebase, no Lovable Cloud, no backend.
- No real admin auth — PIN screen is visual only and "unlocks" the admin dashboard view locally.
- No persistence — data resets on reload (intro shows once per session).

## Technical notes

- Install: `framer-motion`, `recharts`.
- Fonts via Google Fonts `<link>` in `__root.tsx` head.
- Tokens in `src/styles.css` only — no hardcoded hex in components.
- All pages get unique `head()` meta (title, description, og tags) per TanStack Start conventions.