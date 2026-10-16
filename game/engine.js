// ================================================================
//  THE MACHINE  —  you don't need to edit this yet.
//  It draws the board, listens for clicks, keeps the clock, and
//  calls each Mechanic Card at the right moment.
// ================================================================

// --- Where cards and art sign themselves up -------------------
// Each file in logic/ calls registerCard(...). Each file in art/ calls registerArt(...).
const CARDS = [];
function registerCard(card) { CARDS.push(card); }

const ART = {};
function registerArt(key, def) { ART[key] = def; }

// Fallbacks so the game still draws if an art file is missing.
const DEFAULT_ART = {
  player: { emoji: "🙂", color: "#ff8c42" },
  zombie: { emoji: "🟢", color: "#6aa84f" },
  boss:   { emoji: "⭐", color: "#c0392b" },
};
function art(key) { return ART[key] || DEFAULT_ART[key] || { emoji: "?", color: "#999" }; }

// --- Live game state ------------------------------------------
let player;        // { x, y, facing:{dx,dy} }
let zombies;       // array of { x, y, hp }
let boss;          // { x, y, hp }   (hp 0 means the exit is open)
let game;          // the helper object every card receives
let clock = null;  // the 1-second timer
let over = false;  // has the round ended?

function samePos(a, b) { return a.x === b.x && a.y === b.y; }

// --- Setup ----------------------------------------------------
function init() {
  over = false;
  player = { x: GAME.start.x, y: GAME.start.y, facing: { ...GAME.startFacing } };
  zombies = GAME.zombies.map(function (z) { return { x: z.x, y: z.y, hp: 1 }; });
  boss = { x: GAME.goal.x, y: GAME.goal.y, hp: 0 };

  // The object passed to every card: shared state + simple helpers.
  game = {
    cols: GAME.cols,
    rows: GAME.rows,
    player: player,     // kept up to date whenever the player moves
    zombies: zombies,   // the SAME array — it changes in place
    boss: boss,
    // game.health, game.timeLeft, game.score, etc. are created by cards.

    isZombie:  function (p) { return zombies.some(function (z) { return samePos(z, p); }); },
    zombieAt:  function (p) { return zombies.find(function (z) { return samePos(z, p); }) || null; },
    isGoal:    function (p) { return samePos(GAME.goal, p); },
    onGrid:    function (p) { return p.x >= 0 && p.y >= 0 && p.x < GAME.cols && p.y < GAME.rows; },
    squareInFront: function (p) { return { x: p.x + p.facing.dx, y: p.y + p.facing.dy }; },

    // zombies that are right next to a square (up/down/left/right, not diagonal)
    adjacentZombies: function (p) {
      return zombies.filter(function (z) { return Math.abs(z.x - p.x) + Math.abs(z.y - p.y) === 1; });
    },
    isAdjacentToZombie: function (p) { return game.adjacentZombies(p).length > 0; },

    // remove a zombie no matter its health
    killZombieAt: function (p) {
      for (var i = zombies.length - 1; i >= 0; i--) { if (samePos(zombies[i], p)) zombies.splice(i, 1); }
      render();
    },
    // hurt a zombie; it dies at 0 health (health defaults to 1 if a card never set it)
    hurtZombieAt: function (p, amount) {
      var z = game.zombieAt(p);
      if (!z) return;
      if (z.hp === undefined) z.hp = 1;
      z.hp = z.hp - (amount || 1);
      if (z.hp <= 0) game.killZombieAt(p); else render();
    },
    // a strike lands on whatever is in that square: the boss (if alive) or a zombie
    strikeAt: function (p) {
      if (samePos(boss, p) && boss.hp > 0) { boss.hp = boss.hp - 1; render(); return; }
      game.hurtZombieAt(p, 1);
    },
    // attack the square in front of the player; cards may veto it via onAttack()
    attack: function (pl) {
      var target = game.squareInFront(pl);
      var allowed = true;
      CARDS.forEach(function (c) {
        if (c.onAttack && c.onAttack(pl, target, game) === false) allowed = false;
      });
      if (!allowed) { render(); return; }
      game.strikeAt(target);
    },

    rotateRight: function (f) { return { dx: -f.dy, dy: f.dx }; },
    rotateLeft:  function (f) { return { dx: f.dy, dy: -f.dx }; },
    message: toast,
    win:  function (msg) { endRound(true, msg || "You win!"); },
    lose: function (msg) { endRound(false, msg || "Game over."); },
  };
  game.removeZombieAt = game.killZombieAt;   // old name, still works

  // "when 🚩 clicked" — let every card set up its starting values.
  CARDS.forEach(function (c) { if (c.start) c.start(game); });

  document.getElementById("title").textContent = GAME.title;
  buildCardBar();
  buildControls();
  buildLoadedList();
  render();

  // The clock: once per second, run every card's everySecond().
  clock = setInterval(function () {
    if (over) return;
    CARDS.forEach(function (c) { if (c.everySecond) c.everySecond(game); });
    render();
  }, 1000);
}

// --- Doing an action (a card with use(): Move, Turn, Attack) ---
function doAction(card) {
  if (over || !card.use) return;
  const next = card.use({ x: player.x, y: player.y, facing: player.facing }, game);
  if (!next) { render(); return; }

  const moving = (next.x !== player.x || next.y !== player.y);
  if (moving) {
    if (!game.onGrid(next)) { flashWall(); return; }        // stay on the board (engine rule)
    // let cards veto the move (e.g. the boss guarding the exit)
    let blocked = false;
    CARDS.forEach(function (c) { if (c.blocksMove && c.blocksMove(player, next, game)) blocked = true; });
    if (blocked) { flashWall(); return; }
  }
  player = { x: next.x, y: next.y, facing: next.facing || player.facing };
  game.player = player;

  if (moving) {
    CARDS.forEach(function (c) { if (c.onMove) c.onMove(player, game); });
  }

  // "when touching zombie" — tell every card the player stepped on a zombie.
  if (game.isZombie(player)) {
    CARDS.forEach(function (c) { if (c.onZombieHit) c.onZombieHit(game); });
  }

  render();
}

// --- Drawing --------------------------------------------------
function facingArrow(f) {
  if (f.dx === 0 && f.dy === -1) return "↑";
  if (f.dx === 1 && f.dy === 0) return "→";
  if (f.dx === 0 && f.dy === 1) return "↓";
  if (f.dx === -1 && f.dy === 0) return "←";
  return "•";
}

function render() {
  // HUD: each card decides what (if anything) it shows, via its hud() hook.
  const bits = CARDS.map(function (c) { return c.hud ? c.hud(game) : null; }).filter(Boolean);
  document.getElementById("hud").textContent = bits.join("    ");

  // The grid.
  const board = document.getElementById("board");
  // Size the grid to the board: equal columns AND rows, and shape the board to
  // match cols × rows so every cell stays square at any grid size.
  board.style.gridTemplateColumns = "repeat(" + GAME.cols + ", 1fr)";
  board.style.gridTemplateRows = "repeat(" + GAME.rows + ", 1fr)";
  board.style.aspectRatio = GAME.cols + " / " + GAME.rows;
  board.innerHTML = "";
  for (let y = 0; y < GAME.rows; y++) {
    for (let x = 0; x < GAME.cols; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (x === GAME.start.x && y === GAME.start.y) cell.classList.add("start");
      if (x === GAME.goal.x && y === GAME.goal.y) cell.classList.add("goal");

      const here = { x: x, y: y };
      if (player.x === x && player.y === y) {
        cell.classList.add("player");
        cell.innerHTML =
          '<span class="emoji">' + art("player").emoji + '</span>' +
          '<span class="arrow">' + facingArrow(player.facing) + '</span>';
        cell.style.setProperty("--who", art("player").color);
      } else if (game.isGoal(here)) {
        cell.innerHTML = '<span class="emoji">' + art("boss").emoji + '</span>' +
          (boss.hp > 0 ? '<span class="hp">' + boss.hp + '</span>' : '');
        cell.style.setProperty("--who", art("boss").color);
      } else if (game.isZombie(here)) {
        const z = game.zombieAt(here);
        cell.innerHTML = '<span class="emoji">' + art("zombie").emoji + '</span>' +
          (z && z.hp > 1 ? '<span class="hp">' + z.hp + '</span>' : '');
        cell.style.setProperty("--who", art("zombie").color);
      }
      board.appendChild(cell);
    }
  }
}

function buildCardBar() {
  const bar = document.getElementById("cards");
  bar.innerHTML = "";
  CARDS.filter(function (c) { return c.use; }).forEach(function (card) {
    const b = document.createElement("button");
    b.className = "card-btn";
    b.textContent = card.name;
    b.title = card.whatItDoes || "";
    b.addEventListener("click", function () { doAction(card); });
    bar.appendChild(b);
  });
}

function buildLoadedList() {
  const el = document.getElementById("loaded");
  const names = CARDS.map(function (c) { return c.name; });
  el.textContent = names.length ? "Cards loaded: " + names.join(" · ") : "No cards loaded yet.";
}

// A friendly label for a card's key (e.g. " " → "Space", "arrowleft" → "←").
function keyLabel(k) {
  if (k === " ") return "Space";
  const arrows = { arrowleft: "←", arrowright: "→", arrowup: "↑", arrowdown: "↓" };
  const low = k.toLowerCase();
  return arrows[low] || k.toUpperCase();
}

// The keyboard legend — built from whatever cards declare a key, so it always matches.
function buildControls() {
  const el = document.getElementById("controls");
  if (!el) return;
  const keyed = CARDS.filter(function (c) { return c.key && c.use; });
  el.hidden = keyed.length === 0;
  el.innerHTML = keyed.length
    ? '<span class="ctrl-label">Keys</span>' + keyed.map(function (c) {
        return '<span class="ctrl"><kbd>' + keyLabel(c.key) + "</kbd>" + c.name + "</span>";
      }).join("")
    : "";
}

function flashWall() {
  const board = document.getElementById("board");
  board.classList.add("bump");
  setTimeout(function () { board.classList.remove("bump"); }, 250);
}

// A brief message at the bottom of the screen (used by some cards).
function toast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    if (document.body) document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(function () { t.classList.remove("show"); }, 1300);
}

function endRound(won, msg) {
  over = true;
  if (clock) clearInterval(clock);
  const o = document.getElementById("overlay");
  o.hidden = false;
  o.className = won ? "win" : "lose";
  o.innerHTML =
    '<div class="panel">' +
      '<h2>' + (won ? "YOU WIN" : "GAME OVER") + '</h2>' +
      '<p>' + msg + '</p>' +
      '<button id="again">Play again</button>' +
    '</div>';
  document.getElementById("again").addEventListener("click", function () { location.reload(); });
}

// --- Keyboard shortcuts ---------------------------------------
// A card can claim a key with a `key` field (e.g. key: "ArrowUp"); pressing it
// runs that card. The key assignments now live on the cards, not in here.
document.addEventListener("keydown", function (e) {
  // Don't double-fire: if a card button is focused, let Space/Enter click it.
  const focused = document.activeElement;
  if ((e.key === " " || e.key === "Enter") && focused && focused.tagName === "BUTTON") return;

  const pressed = e.key.toLowerCase();
  const card = CARDS.find(function (c) { return c.key && c.key.toLowerCase() === pressed; });
  if (card && card.use) { e.preventDefault(); doAction(card); }
});

document.addEventListener("DOMContentLoaded", init);
