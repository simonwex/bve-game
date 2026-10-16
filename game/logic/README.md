# logic/ — the rules

**Logic** is one of your four stats from Week 1. It's *how the game works*.

In here, **one mechanic = one file** — just like the paper Mechanic Cards you made.
Every card is built the same way:

```js
registerCard({
  name: "Health",
  whatItDoes: "...",
  limit: "...",
  // then the hooks it needs:
});
```

## The hooks (the machine calls these for you — just like Scratch "when…" blocks)

| hook | runs… | like Scratch |
| --- | --- | --- |
| `start(game)` | once, at the beginning | when 🚩 clicked |
| `use(player, game)` | when its button is pressed (also makes a button) | when this sprite clicked |
| `onZombieHit(game)` | when the player steps on a zombie | when touching zombie |
| `everySecond(game)` | once per second | forever / wait 1s |
| `onMove(player, game)` | after the player moves to a new square | when key pressed |
| `onAttack(player, target, game)` | when the player attacks — return `false` to cancel | — |
| `hud(game)` | returns a short string to show at the top of the screen | — |
| `blocksMove(from, to, game)` | return `true` to block a move | — |

There's also a **`key`** field (not a hook): a `use()` card can set a keyboard shortcut,
e.g. `key: "a"` or `key: " "` (the spacebar). Matching ignores capital letters.

A few helpers on `game` the fancier cards use: `game.player`, `game.zombies`,
`game.boss`, `game.adjacentZombies(pos)`, `game.isAdjacentToZombie(pos)`,
`game.hurtZombieAt(pos, n)`, `game.zombieAt(pos)`, `game.message("…")`.

> The engine is a **generic machine** — it has no rules of its own beyond "stay on the
> grid." Winning lives in the **`reach-the-exit`** card; the boss guarding the exit lives
> in **`boss-battle`** (`blocksMove`); the ❤️/⏱ readouts live in **`health`**/**`timer`**
> (`hud`); the arrow keys live on the movement cards (`key`).

## Make your own card
1. Copy `_card-template.js`, rename it (e.g. `score.js`).
2. Fill in the name and the blanks; keep only the hooks you need.
3. Add one line in `index.html`: `<script src="logic/score.js"></script>`.
4. Reload the page — your card is live.

The cards wired in now: `move-forward`, `turn-left`, `turn-right` (movement),
`reach-the-exit` (the win rule), `health`, `timer`. (No attack by default.)

**`fight-back.js`** is the attack card the class builds together — it gives zombies health
(`start`), then on `use` takes a hit off (`change`) and removes them at 0 (`if`): variable →
change → if, all in one card. It's shipped but left commented in `index.html` so the class wires
it live. **`attack.js`** is a simpler one-hit alternative (it leans on the engine's strike system,
which the optional combat cards below also use).

## Optional mechanics menu (off by default)
Each is a full card in this folder. Turn one on by uncommenting its line in
`index.html`. Dependencies and clashes:

| card | does | needs | note |
| --- | --- | --- | --- |
| `tough-zombies` | zombies take 2 hits | Attack | hit-count shows on the zombie |
| `zombie-strike` | adjacent zombies hit you each second | Health | — |
| `patient-zombies` | a zombie hits only after 1s adjacent | Health | **don't** use with `zombie-strike` |
| `deadly-touch` | stepping on a zombie = instant game over | — | with Health, this still wins |
| `swing-and-step` | one strike per square (move between hits) | Attack | — |
| `boss-battle` | boss takes 5 hits; guards the exit | Attack | can't win until the boss is beaten |
