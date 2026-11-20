// ================================================================
//  🚶 THE SPRITE MACHINE  —  you don't need to edit this file.
//  It draws the map and walks the character for you. On every page
//  you get these commands to use inside walk():
//
//     forward()            take one step the way you're facing
//     turnLeft()           turn left  (stay on the same square)
//     turnRight()          turn right (stay on the same square)
//     go("forward")        same as forward()  ("left" / "right" turn)
//     wait(ms)             pause for a moment
//
//  Peeking commands (for later lessons — "sensing"):
//     wallAhead()          true if a wall/water is right in front
//     canGoForward()       true if you CAN step forward
//     wallLeft()  wallRight()
//     atGoal()             true once you're standing on the ⭐
//     facing()             "up" / "down" / "left" / "right"
//
//  The code YOU write goes in the matching .js file (like
//  02-turn-and-walk.js), inside a function called walk().
// ================================================================

// --- The ONE map everybody walks. An open grassy field with a few
//     obstacles to walk around. 16 wide, 8 tall. Tiles:
//        .  grass (walk here)        o  water  (can't cross)
//        R  rock   (obstacle)        b  bush   (obstacle)
//        S  start (bottom-left)      *  goal (the ⭐) -------------
var WORLD = {
  facing: "up",           // the character starts facing this way
  map: [
    "................",
    "..........oo..*.",
    "...R....b.......",
    "......ooo.......",
    "...b..ooo....R..",
    "...........b....",
    ".S.........RR...",
    "................"
  ]
};

// --- Safety limit (so a runaway loop can't freeze the page) -------
var MAX_STEPS = 400;     // can't make more than this many moves in one go
var STEP_MS = 260;       // how long each step/turn takes to animate

// --- Directions: name <-> vector {dx,dy}. y grows DOWN the screen,
//     exactly like the real game (engine.js). -----------------------
var DIRS = {
  up:    { dx: 0, dy: -1 },
  right: { dx: 1, dy: 0 },
  down:  { dx: 0, dy: 1 },
  left:  { dx: -1, dy: 0 }
};
function dirName(v) {
  if (v.dx === 0 && v.dy === -1) { return "up"; }
  if (v.dx === 1 && v.dy === 0) { return "right"; }
  if (v.dx === 0 && v.dy === 1) { return "down"; }
  return "left";
}

// --- The parsed world: where the start and goal are, which squares
//     you can walk on. Built once from WORLD. ----------------------
var GRID = null, COLS = 0, ROWS = 0, START = null, GOAL = null;

function parseWorld() {
  GRID = WORLD.map.slice();
  ROWS = GRID.length;
  COLS = GRID[0].length;
  var x, y;
  for (y = 0; y < ROWS; y++) {
    for (x = 0; x < COLS; x++) {
      var ch = GRID[y].charAt(x);
      if (ch === "S") { START = { x: x, y: y }; }
      if (ch === "*") { GOAL = { x: x, y: y }; }
    }
  }
  if (!START) { START = { x: 1, y: 1 }; }
}

function tileAt(x, y) {
  if (x < 0 || y < 0 || x >= COLS || y >= ROWS) { return "#"; }  // off the map = wall
  return GRID[y].charAt(x);
}
// grass '.', sand ',', the start 'S' and the goal '*' are all walkable.
function isWalkable(x, y) {
  var ch = tileAt(x, y);
  return ch === "." || ch === "," || ch === "S" || ch === "*";
}

// --- The live "pretend walk" the student's code drives -------------
// sim is where the character IS as walk() runs; every command pushes
// a frame onto `frames`, and then we animate the frames one by one.
var sim = null;      // { x, y, dir:{dx,dy} }
var frames = [];     // list of { x, y, dir, bump }
var stepCount = 0;

function resetSim() {
  sim = { x: START.x, y: START.y, dir: DIRS[WORLD.facing] || DIRS.right };
  frames = [];
  stepCount = 0;
}

function stopForSafety(reason) {
  var e = new Error(reason);
  e.limit = true;    // marks this as a "safety" stop, not a real bug
  throw e;
}
function countStep() {
  stepCount++;
  if (stepCount > MAX_STEPS) {
    stopForSafety("Whoa! That kept going and going, so I stopped it. " +
      "Check your loop — maybe it never stops, or try smaller numbers.");
  }
}

// ---- The commands the student calls ------------------------------
function forward() {
  countStep();
  var nx = sim.x + sim.dir.dx, ny = sim.y + sim.dir.dy;
  if (isWalkable(nx, ny)) {
    sim.x = nx; sim.y = ny;
    frames.push({ x: sim.x, y: sim.y, dir: sim.dir, bump: false });
  } else {
    // walked into a wall/water or off the map: stay put, bump.
    frames.push({ x: sim.x, y: sim.y, dir: sim.dir, bump: true });
  }
}
function turnRight() {
  countStep();
  sim.dir = { dx: -sim.dir.dy, dy: sim.dir.dx };   // same math as the game
  frames.push({ x: sim.x, y: sim.y, dir: sim.dir, bump: false });
}
function turnLeft() {
  countStep();
  sim.dir = { dx: sim.dir.dy, dy: -sim.dir.dx };
  frames.push({ x: sim.x, y: sim.y, dir: sim.dir, bump: false });
}
function go(which) {
  if (which === "left") { turnLeft(); }
  else if (which === "right") { turnRight(); }
  else { forward(); }
}
function wait(ms) {
  countStep();
  var f = { x: sim.x, y: sim.y, dir: sim.dir, bump: false, wait: ms || STEP_MS };
  frames.push(f);
}

// ---- Peeking / "sensing" commands (used in later lessons) --------
function wallAhead() { return !isWalkable(sim.x + sim.dir.dx, sim.y + sim.dir.dy); }
function canGoForward() { return !wallAhead(); }
function wallRight() { var d = { dx: -sim.dir.dy, dy: sim.dir.dx }; return !isWalkable(sim.x + d.dx, sim.y + d.dy); }
function wallLeft() { var d = { dx: sim.dir.dy, dy: -sim.dir.dx }; return !isWalkable(sim.x + d.dx, sim.y + d.dy); }
function atGoal() { return GOAL && sim.x === GOAL.x && sim.y === GOAL.y; }
function facing() { return dirName(sim.dir); }

// ================================================================
//  Drawing the board + animating the walk.
// ================================================================
var boardEl = null, spriteEl = null, imgEl = null, playTimer = null;

var TILE_CLASS = {
  "#": "water", "~": "water", "o": "water",   // water = impassable
  "R": "rock", "b": "bush",                    // rock / bush obstacles, drawn on grass
  ".": "grass", ",": "sand", "S": "grass", "*": "grass"
};

function buildBoard() {
  var stage = document.querySelector(".stage");
  if (!stage) { return; }
  stage.innerHTML = "";
  boardEl = document.createElement("div");
  boardEl.className = "board";
  boardEl.style.gridTemplateColumns = "repeat(" + COLS + ", 1fr)";
  boardEl.style.gridTemplateRows = "repeat(" + ROWS + ", 1fr)";

  var x, y;
  for (y = 0; y < ROWS; y++) {
    for (x = 0; x < COLS; x++) {
      var ch = GRID[y].charAt(x);
      var cell = document.createElement("div");
      cell.className = "cell " + (TILE_CLASS[ch] || "grass");
      if (ch === "*") { cell.className += " goal"; }
      boardEl.appendChild(cell);
    }
  }
  stage.appendChild(boardEl);

  // the walking character sits on top of the grid
  spriteEl = document.createElement("div");
  spriteEl.className = "sprite";
  imgEl = document.createElement("img");
  imgEl.alt = "the character";
  spriteEl.appendChild(imgEl);
  stage.appendChild(spriteEl);

  placeSprite(START.x, START.y, DIRS[WORLD.facing] || DIRS.right, false);
}

// put the sprite on a cell (x,y) facing `dir`. `animate` = glide there.
function placeSprite(x, y, dir, animate) {
  if (!spriteEl || !boardEl) { return; }
  var cellW = boardEl.clientWidth / COLS;
  var cellH = boardEl.clientHeight / ROWS;
  // the character art is taller than one cell; stand its feet in the cell.
  var w = cellW * 1.0;
  var h = cellH * 1.55;
  spriteEl.style.width = w + "px";
  spriteEl.style.height = h + "px";
  spriteEl.style.transition = animate ? ("transform " + STEP_MS + "ms linear") : "none";
  var left = x * cellW + (cellW - w) / 2;
  var top = y * cellH + (cellH - h) + cellH * 0.12;   // feet near the bottom of the cell
  spriteEl.style.transform = "translate(" + left + "px," + top + "px)";
  imgEl.src = "assets/player-" + dirName(dir) + ".png";
}

function clearTimers() {
  if (playTimer) { clearTimeout(playTimer); playTimer = null; }
}

// Snap everything back to the start.
function resetWalk() {
  clearTimers();
  resetSim();
  if (spriteEl) {
    spriteEl.classList.remove("bump");
    placeSprite(START.x, START.y, DIRS[WORLD.facing] || DIRS.right, false);
  }
}

// Play the recorded frames, one every STEP_MS.
function animateFrames(onDone) {
  var i = 0;
  function next() {
    if (i >= frames.length) { if (onDone) { onDone(); } return; }
    var f = frames[i];
    if (f.bump) {
      // shove toward the wall and bounce back
      var cellW = boardEl.clientWidth / COLS;
      var cellH = boardEl.clientHeight / ROWS;
      spriteEl.style.setProperty("--bx", (f.dir.dx * cellW * 0.3) + "px");
      spriteEl.style.setProperty("--by", (f.dir.dy * cellH * 0.3) + "px");
      imgEl.src = "assets/player-" + dirName(f.dir) + ".png";
      spriteEl.classList.remove("bump");
      void imgEl.offsetWidth;           // restart the animation (on the img)
      spriteEl.classList.add("bump");
    } else {
      placeSprite(f.x, f.y, f.dir, true);
    }
    i++;
    playTimer = setTimeout(next, f.wait || STEP_MS);
  }
  next();
}

// ================================================================
//  The ▶ Play / ⏹ Reset / ▶ Finished buttons on each page.
//  Each lesson file defines walk() (the student types it); each
//  -done.js file defines walkDone() (the finished version).
// ================================================================

// Runs a walk-style function, fills `frames`, returns a message or null.
function recordWalk(fn, missingMessage) {
  if (typeof fn !== "function") { return missingMessage; }
  resetWalk();
  try {
    fn();
    return null;
  } catch (err) {
    if (err && err.limit) { return err.message; }   // friendly safety stop
    console.log("Error while walking:", err);
    return err.message;
  }
}

// Pulls the body out of a function so we can show it as the "example".
function bodyOf(fn) {
  var s = fn.toString();
  var open = s.indexOf("{");
  var close = s.lastIndexOf("}");
  if (open < 0 || close < 0) { return s; }
  var lines = s.slice(open + 1, close).replace(/^\n+/, "").replace(/\s+$/, "").split("\n");
  var min = null, i;
  for (i = 0; i < lines.length; i++) {
    if (lines[i].trim().length) {
      var lead = lines[i].match(/^ */)[0].length;
      if (min === null || lead < min) { min = lead; }
    }
  }
  if (min === null) { min = 0; }
  for (i = 0; i < lines.length; i++) { lines[i] = lines[i].slice(min); }
  return lines.join("\n");
}

function showExample() {
  var view = document.querySelector(".code-view");
  if (!view) { return; }
  view.textContent = (typeof walkDone === "function") ? bodyOf(walkDone) : "// (example missing)";
}

function finishMessage(msg) {
  if (!msg) { return; }
  if (atGoal()) {
    msg.textContent = "⭐ You reached the goal! Nice walking.";
    msg.className = "msg win";
  } else {
    msg.className = "msg";
  }
}

function runAndPlay(fn, missingMessage, msg) {
  if (msg) { msg.textContent = ""; msg.className = "msg"; }
  var problem = recordWalk(fn, missingMessage);
  if (problem) {
    if (msg) { msg.textContent = "⚠️ " + problem; }
    return;
  }
  if (frames.length === 0) {
    if (msg) { msg.textContent = "Nothing happened yet — type the example into your .js file, save (⌘S), and reload."; }
    return;
  }
  animateFrames(function () { finishMessage(msg); });
}

function wireLesson() {
  parseWorld();
  resetSim();
  showExample();
  buildBoard();

  var msg = document.querySelector(".msg");
  var playBtn = document.querySelector(".play");
  var doneBtn = document.querySelector(".finished");
  var stopBtn = document.querySelector(".stop");

  if (playBtn) {
    playBtn.addEventListener("click", function () {
      runAndPlay(window.walk, "I can't find your walk() function — check the .js file for a typo, then reload.", msg);
    });
  }
  if (doneBtn) {
    doneBtn.addEventListener("click", function () {
      runAndPlay(window.walkDone, "(the finished version is missing)", msg);
    });
  }
  if (stopBtn) {
    stopBtn.addEventListener("click", function () {
      resetWalk();
      if (msg) { msg.textContent = "⏹ Back to the start."; msg.className = "msg"; }
    });
  }

  // keep the sprite sized right if the window changes
  window.addEventListener("resize", function () {
    placeSprite(sim.x, sim.y, sim.dir, false);
  });
}

document.addEventListener("DOMContentLoaded", wireLesson);

// If a lesson .js file has a typo it won't load at all — show a friendly hint.
window.addEventListener("error", function (e) {
  var msg = document.querySelector(".msg");
  if (msg && e && e.message) {
    msg.textContent = "⚠️ " + e.message + "  (fix your .js file, save, and reload)";
  }
});
