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
- [ ] Open `game/index.html` in Chrome yourself and play it (turn, move, survive). Note: there's
      **no attack yet** — that's the card we build together. Confirm it runs from a double-click.
- [ ] Open `game/tests.html` — confirm the summary is green.
- [ ] Have your **pile of class mechanic cards** ready and **assign one per kid** (Timer, Score,
      Health-Pickup, Boss-HP, Double-Step…). Timer ships as a working example, so if you hand that
      out, the kid is re-deriving a known-good card — fine for a nervous starter.
- [ ] Projector mirrors your screen with **VS Code and Chrome side by side**.

## Room setup
- Kids at Macs, you at the projector. VS Code open on the `game` folder; Chrome open on `index.html`.
- Keep the paper Mechanic Cards from Week 1 visible — we're turning paper into code.

---

## Timeline

### 0:00–0:06 — Recap + hook: our paper game, now digital
Open `index.html` on the projector. "Last week we designed this and played it with our bodies.
I taught it to the computer." Play it: ← / → to turn, **Space** to move, walk the maze. Point out:
*"You can move, and the zombies can hurt you — but there's no way to fight back yet. Today we
build that, and you each add a power."*

### 0:06–0:14 — The map: four folders = your four stats
Show the `game` folder in VS Code. "Remember your Week 1 stats? They're the folders."
- `logic/` = **how it works** (the rules). ← today
- `art/` = **how it looks** · `story/` = **the why** · `sound/` = **music** (coming soon)

Open `logic/`. "**One mechanic = one file** — exactly like our paper cards." Point out the
movement cards plus `health.js` and `timer.js`.

### 0:14–0:24 — Read `health.js` together (the three big ideas)
This is the **getting-attacked** side of combat (in a minute we'll build the **fighting-back**
side — same three ideas). Open `logic/health.js` on the projector. Walk the three ideas slowly:
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

### 0:24–0:36 — Build **Fight Back** together (the worked example)
Now the class writes a card with **all three ideas** — the *fighting-back* side. Right now the
zombies can hurt you but you can't hurt them; let's fix that.
1. In VS Code, copy `logic/_card-template.js` → rename `logic/fight-back.js`.
2. Fill it in together, naming each idea out loud as you type it:
   ```js
   registerCard({
     name: "Fight Back",
     whatItDoes: "Swing at the zombie in front. Zombies take 2 hits.",
     limit: "You stay put when you swing.",
     key: "a",

     start(game) {                                 // 1) a VARIABLE
       game.zombies.forEach(function (z) { z.hp = 2; });
     },
     use(player, game) {
       const target = game.squareInFront(player);  // the square you're facing
       const z = game.zombieAt(target);            // a zombie there?
       if (z) {
         z.hp = z.hp - 1;                          // 2) CHANGE it
         if (z.hp <= 0) game.removeZombieAt(target); // 3) an IF
       }
       return player;                              // you don't move
     },
   });
   ```
3. **Wire it:** uncomment the Fight Back line in `index.html` (or add
   `<script src="logic/fight-back.js"></script>`).
4. Reload. A **Fight Back** button appears (and **A** works). Zombies now show a **2**; face one and
   swing — it drops to **1**, swing again — it's **gone**. "You set a number, you changed it, and
   you asked a yes/no question. That's most of programming."

*Teaching beats:* `start` is the **variable** (every zombie gets `hp = 2`). Inside `use`,
`z.hp = z.hp - 1` is **changing** it, and `if (z.hp <= 0)` is the **if**. Same shape as the Health
card they just read — one side gets attacked, the other fights back.

### 0:36–0:50 — Your turn: each kid builds their card
Hand each kid their assigned mechanic. Same four steps: **copy the template → rename → fill the
blanks → add one `<script>` line → reload and playtest.** Circulate. Most cards need only `start`
plus one of the other hooks. Keep the paper card next to the Mac — name / what it does / limit map
straight onto the file.

Common helpers to point them to (all on `game`): `game.health`, `game.timeLeft`, `game.score`,
`game.lose("…")`, `game.win("…")`, `game.squareInFront(player)`, `game.zombieAt(pos)`,
`game.removeZombieAt(pos)`.

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
