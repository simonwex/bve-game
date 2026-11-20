# sprite/ — the Sprite Lab

**Art** and **The Machine** are two of your four stats from Week 1. This lab sits right
between them: you drive a real character around a tiled map by giving it **commands** — the
same *turn, then walk forward* idea as the game's move cards.

Open `index.html` in Chrome (double-click it) and work through the five steps:

1. `01-one-step.html` — a command is one line of code (`forward()`)
2. `02-turn-and-walk.html` — turning changes your **facing**, not your square
3. `03-walk-the-path.html` — a long, all-typed-out journey (on purpose — it's tedious!)
4. `04-loop-the-boring-bits.html` — a **loop** repeats a line for you
5. `05-follow-a-route.html` — a route is a **list** of moves + a loop

**How a step works.** Each page shows an **example** (the finished code) in a dark box. The
student **types that example into the matching `.js` file** (e.g. `02-turn-and-walk.js`, inside
the `walk()` function), presses **⌘S** to save, reloads (**⌘R**), and presses **▶ Play mine**
to watch their own version walk. Their `.js` file is their saved work.

**Buttons:** ▶ Play mine runs the student's `walk()`. ⏹ Reset puts the character back at the
start. ▶ Finished version runs `teacher/*-done.js` — for a demo, or a stuck kid. (Finished
versions live in `teacher/` so they're not sitting next to the student files.)

**Everyone explores the same field.** The one shared map lives in `sprite.js` as `WORLD` (16
wide × 8 tall): an open grassy field with scattered obstacles. Grass is walkable; **water (`o`),
rocks (`R`), and bushes (`b`) are obstacles** to walk around. The character starts **bottom-left
(`S`) facing up**; the ⭐ (`*`, top-right) is the goal. Edit the `WORLD` map to change the field.

**Commands (the "machine" gives you these):**

- `forward()` — one step the way you're facing
- `turnLeft()` / `turnRight()` — turn in place (same 90° math as the real game)
- `go("forward" | "left" | "right")` — handy when your moves are in a list
- `wait(ms)` — pause

**Peeking commands ("sensing") — ready for the next lesson:** `wallAhead()`, `canGoForward()`,
`wallLeft()`, `wallRight()`, `atGoal()`, `facing()`. These let you write code that *looks* before
it moves, e.g. `if (wallAhead()) { turnLeft(); } else { forward(); }`, or
`while (!atGoal()) { ... }` — the start of a real "find your way out" algorithm (Part 2).

**Safety:** a walk can't make more than ~400 moves in one go, so a loop that never stops (or a
giant number) just gets a friendly "that kept going" message instead of freezing the page.
Walking into water/trees bumps you — you stay put, no crash.

**Files:** `sprite.js` is "the machine" (draws the map, walks the character, runs the buttons —
you don't edit it). `sprite.css` is the shared look. `assets/` holds the sliced character frames
(`player-up/down/left/right.png`), the ground tiles (`tile-grass/sand/water.png`), and the
obstacle objects (`obj-rock.png`, `obj-bush.png`), all cut from the art in `../art/sprites/`. `NN-name.js` = the file the student types into. `teacher/NN-name-done.js` =
the finished version. Everything runs straight from the file, no internet needed (except the web
fonts).
