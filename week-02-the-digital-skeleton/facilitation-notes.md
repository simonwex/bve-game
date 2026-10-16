# Week 2 — The Digital Skeleton · Instructor Facilitation Notes

**Session:** Week 2 of 8 · ~60 min · 6 students (ages 11–12) · taught solo
**On-screen title (what the kids see):** *Press Start* — "The Digital Skeleton" is our name for the week.
**Computers:** Each kid on a Mac with **VS Code**; the game runs by opening `game/index.html` in **Chrome**.
**Language:** JavaScript. First real text code — the kids are one step past Scratch.

---

## What this hour is really for

Three ideas should be true by the end:

1. **A game is made of files, and each mechanic is one file** — just like the paper cards.
2. **Code is mostly three things today:** a **variable** (a number we keep), **changing** it
   (a little math), and an **`if`** (a true/false question).
3. **The computer calls your card at the right moment** — `start`, `when touching zombie`,
   `every second` — which are just Scratch's "when…" blocks with new clothes.

**By the end, every kid has:** opened our Zombie Maze in VS Code, played it, understood
`health.js`, and **written their own mechanic card** (their own `.js` file) and seen it work.

The code is organised by the **four stats from Week 1** — `logic/`, `art/`, `story/`, `sound/`.
Today lives entirely in **Logic**.

---

## Before class (prep)

- [ ] **Get the starter onto all 6 Macs.** Pick one: zip the `game/` folder and AirDrop it; drop
      it in a shared folder; or push to GitHub and have them clone. Each kid needs their **own copy**.
- [ ] Open `game/index.html` in Chrome yourself and play it (turn, move, attack). Confirm it runs
      from a double-click (no server needed).
- [ ] Open `game/tests.html` — confirm the summary is green ("15 / 15 tests passed").
- [ ] Have your **pile of class mechanic cards** ready and **assign one per kid** (Timer, Attack,
      Score, Health-Pickup, Boss-HP, Double-Step…). Timer and Attack ship as working examples, so
      if you hand those out, the kid is re-deriving a known-good card — fine for a nervous starter.
- [ ] Projector mirrors your screen with **VS Code and Chrome side by side**.

## Room setup
- Kids at Macs, you at the projector. VS Code open on the `game` folder; Chrome open on `index.html`.
- Keep the paper Mechanic Cards from Week 1 visible — we're turning paper into code.

---

## Timeline

### 0:00–0:06 — Recap + hook: our paper game, now digital
Open `index.html` on the projector. "Last week we designed this and played it with our bodies.
I taught it to the computer." Play it: press **Turn** and **Move Forward** to walk the maze; press
**Attack** next to a zombie. Then point out: *"Notice — nothing bad happens yet. You can't lose.
Today we add the danger, and you each add a power."*

### 0:06–0:14 — The map: four folders = your four stats
Show the `game` folder in VS Code. "Remember your Week 1 stats? They're the folders."
- `logic/` = **how it works** (the rules). ← today
- `art/` = **how it looks** · `story/` = **the why** · `sound/` = **music** (coming soon)

Open `logic/`. "**One mechanic = one file** — exactly like our paper cards." Point out the
movement cards and `health.js`, `timer.js`, `attack.js`.

### 0:14–0:24 — Read `health.js` together (the three big ideas)
Open `logic/health.js` on the projector. Walk the three ideas slowly:
- **A variable:** `game.health = 3;` — "a number the game remembers."
- **Change it (math):** `game.health = game.health - 1;` — "take one away."
- **An `if`:** `if (game.health <= 0) game.lose(...)` — "ask a yes/no question, do something if yes."

Then the **Scratch bridge** — these are "when…" blocks:
| In our card | In Scratch |
| --- | --- |
| `start(game)` | when 🚩 clicked |
| `onZombieHit(game)` | when touching zombie |
| `everySecond(game)` | forever / wait 1 second |
| `use(player, game)` | when this sprite clicked (a button) |

**Everyone try it:** change `game.health = 3` to `5`, save, reload Chrome. Health changes.
"You just programmed." (Confidence win — a one-character edit with a visible result.)

### 0:24–0:34 — Build a new card together (the worked example)
Make a brand-new card as a class so they see the full loop. Suggested: a **Score** card.
1. In VS Code, copy `logic/_card-template.js` → rename `logic/score.js`.
2. Fill it in together:
   ```js
   registerCard({
     name: "Score",
     whatItDoes: "Earn a point for every second you survive.",
     limit: "Points only go up.",
     start(game)       { game.score = 0; },
     everySecond(game) { game.score = game.score + 1; },
   });
   ```
3. **Wire it:** add one line in `index.html` under "ADD YOUR CARD HERE":
   `<script src="logic/score.js"></script>`
4. Reload. A score appears in the HUD and climbs. "Make a file, add one line, and the game grew."

### 0:34–0:50 — Your turn: each kid builds their card
Hand each kid their assigned mechanic. Same four steps: **copy the template → rename → fill the
blanks → add one `<script>` line → reload and playtest.** Circulate. Most cards need only `start`
plus one of the other hooks. Keep the paper card next to the Mac — name / what it does / limit map
straight onto the file.

Common helpers to point them to (all on `game`): `game.health`, `game.timeLeft`, `game.score`,
`game.lose("…")`, `game.win("…")`, `game.removeZombieAt(game.squareInFront(player))`.

### 0:50–0:57 — Show & tell + run the tests
Demo 2–3 kids' cards on the projector. Then open `tests.html`: "This checks the game still works —
green means all good." Great moment to normalise testing. If someone's card broke something, the
tests (or the Chrome console, ⌥⌘J) help you spot it.

### 0:57–1:00 — Wrap + tease Week 3
"You wrote real code: a variable, some math, an `if` — and a mechanic that plugs into the game,
just like your paper card. Next week we give the zombies a brain and make them move."

---

## Managing these 6

- **Typos are the #1 issue.** Teach the Chrome console (⌥⌘J) early: a red error usually names the
  file and line. A missing `}` or `;` or a mismatched quote is the usual culprit.
- **Case matters:** `registerCard`, not `registercard`. `game.health`, not `Game.Health`.
- **The `<script>` line is the step they forget** — the file exists but "nothing happens." First
  thing to check when a card seems dead.
- **Fast finishers → side-quests** (below), or help a neighbour (great for the high-Logic kids).
- **One shared win:** if time allows, have everyone paste their favourite classmate's card into
  their own copy to feel the "deck of cards" grow.

## Side-quests (fast finishers)
- **Health Pickup:** a card that *adds* health.
- **Time Bonus:** add seconds somewhere.
- **Boss HP:** the exit needs 2 hits before it counts as a win (a second variable + an `if`).
- **Make it yours:** tune the numbers for a brutal vs. gentle run; change an emoji in `art/`.

## Prep checklist (night before)
- [ ] Starter copied to all 6 Macs; each opens in Chrome from a double-click.
- [ ] `tests.html` green on your machine.
- [ ] Card pile assigned, one per kid (plus 2 spares).
- [ ] Projector: VS Code + Chrome side by side; `health.js` open and ready.
- [ ] Deck (`slides.html`) loaded; cheat-sheet printed, one per kid.
