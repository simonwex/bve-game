// ================================================================
//  🔊 THE SOUND MACHINE  —  you don't need to edit this file.
//  It knows how to make beeps. On every page you get three tools:
//
//     tone(pitch, howLong)     play one sound
//     rest(howLong)            a little silence
//
//  The code YOU write goes in the matching .js file (like
//  02-intermittent-beep.js), inside a function called play().
// ================================================================

// --- Safety limits (so a giant number can't play forever) -----
var MAX_NOTE_MS = 2000;       // one sound can't be longer than 2 seconds
var MAX_TOTAL_SECONDS = 10;   // the whole thing can't be longer than 10 seconds
var MAX_OPS = 3000;           // and can't make more than 3000 sounds in one go

// --- The one speaker the whole page shares --------------------
// (Browsers won't make sound until you click something, so we
//  build this the first time you press ▶ Play.)
var audio = null;
var master = null;     // everything plays through here…
var analyser = null;   // …which also feeds this, so a page can SEE the wave (the slides' scope)
var cursor = 0;        // WHEN the next sound should start (in seconds)
var startCursor = 0;   // when THIS run started (to measure total length)
var opCount = 0;       // how many sounds this run has made so far

// Builds the master-gain + analyser tap on the current context (once per context).
function ensureGraph(ctx) {
  if (master && master.context === ctx) { return; }
  master = ctx.createGain();
  master.gain.value = 1;
  analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  master.connect(ctx.destination);
  master.connect(analyser);
}

function getAudio() {
  if (!audio) {
    var Maker = window.AudioContext || window.webkitAudioContext;
    audio = new Maker();
  }
  ensureGraph(audio);
  return audio;
}

// Lets a page (e.g. the slides' oscilloscope) read the live waveform. May be null when idle.
function getAnalyser() { return analyser; }

// Trips the safety brake: stops the student's loop with a friendly message.
function stopForSafety(reason) {
  var e = new Error(reason);
  e.limit = true;   // marks this as a "safety" stop, not a real bug
  throw e;
}

// Called inside tone() and rest(): have we gone too far this run?
function checkLimits() {
  opCount = opCount + 1;
  if (opCount > MAX_OPS || (cursor - startCursor) > MAX_TOTAL_SECONDS) {
    stopForSafety("Whoa! That was going to run way too long, so I stopped it. " +
      "Try smaller numbers (shorter sounds, or fewer times around the loop).");
  }
}

// --- tone(pitch, howLong) -------------------------------------
// pitch   = how high/low, in "hertz" (bigger number = higher sound)
// howLong = how many milliseconds it lasts (1000 = one second)
function tone(pitch, howLong) {
  var ctx = getAudio();
  if (cursor < ctx.currentTime) { cursor = ctx.currentTime; }  // never schedule in the past
  if (howLong === undefined) { howLong = 200; }
  if (howLong > MAX_NOTE_MS) { howLong = MAX_NOTE_MS; }         // added zeros? we cap it here
  if (howLong < 0) { howLong = 0; }
  checkLimits();

  var seconds = howLong / 1000;
  var fade = Math.min(0.01, seconds / 2);                       // tiny fade so it doesn't "click"

  var osc = ctx.createOscillator();
  var vol = ctx.createGain();
  osc.type = "square";             // a fun, retro 8-bit sound
  osc.frequency.value = pitch;

  var t = cursor;
  vol.gain.setValueAtTime(0, t);
  vol.gain.linearRampToValueAtTime(0.2, t + fade);
  vol.gain.setValueAtTime(0.2, t + seconds - fade);
  vol.gain.linearRampToValueAtTime(0, t + seconds);

  osc.connect(vol);
  vol.connect(master);             // → master → speaker + analyser (so the scope can see it)
  osc.start(t);
  osc.stop(t + seconds);

  cursor = t + seconds;            // the next sound waits until this one is done
}

// --- rest(howLong) --------------------------------------------
// A gap of silence. Moves the clock forward without any sound.
function rest(howLong) {
  var ctx = getAudio();
  if (cursor < ctx.currentTime) { cursor = ctx.currentTime; }
  if (howLong === undefined) { howLong = 200; }
  if (howLong > MAX_NOTE_MS) { howLong = MAX_NOTE_MS; }
  if (howLong < 0) { howLong = 0; }
  checkLimits();
  cursor = cursor + howLong / 1000;
}

// ================================================================
//  The ▶ Play / ⏹ Stop / ▶ Finished buttons on each page.
//  Each lesson file defines play() (the student types it); each
//  -done.js file defines playDone() (the finished version).
// ================================================================

// Stops ALL sound right now (closes the speaker; the next Play builds a fresh one).
function stopAll() {
  if (audio) {
    try { audio.close(); } catch (e) { /* already closed — fine */ }
    audio = null;
    master = null;
    analyser = null;
  }
}

// Starts a fresh run: clears any old sound, unlocks the speaker, and resets the clock + the
// safety counters. Call this right before scheduling tones. (The slides use it too.)
function beginRun() {
  stopAll();                         // clear any sound still playing from last time
  var ctx = getAudio();
  if (ctx.state === "suspended") { ctx.resume(); }  // the click unlocks the speaker
  cursor = ctx.currentTime;          // start the clock at "now"
  startCursor = cursor;
  opCount = 0;
  return ctx;
}

// Runs a play-style function (the student's play, or the finished playDone).
// Returns a message to show, or null if it ran cleanly.
function runUserCode(fn, missingMessage) {
  if (typeof fn !== "function") { return missingMessage; }
  beginRun();
  try {
    fn();
    return null;
  } catch (err) {
    if (err && err.limit) { return err.message; }   // a safety stop — message is already friendly
    console.log("Error while playing:", err);
    return err.message;
  }
}

// Pulls the body out of a function so we can show it as the "example" (no wrapper, dedented).
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

// Shows the finished example on the page (read-only), straight from playDone().
function showExample() {
  var view = document.querySelector(".code-view");
  if (!view) { return; }
  view.textContent = (typeof playDone === "function") ? bodyOf(playDone) : "// (example missing)";
}

// Finds the buttons on the page and wires them up.
function wireLesson() {
  showExample();
  var msg = document.querySelector(".msg");
  var playBtn = document.querySelector(".play");
  var doneBtn = document.querySelector(".finished");
  var stopBtn = document.querySelector(".stop");

  if (playBtn) {
    playBtn.addEventListener("click", function () {
      if (msg) { msg.textContent = ""; }
      var problem = runUserCode(window.play, "I can't find your play() function — check the .js file for a typo, then reload.");
      if (problem) {
        if (msg) { msg.textContent = "⚠️ " + problem; }
      } else if (opCount === 0 && msg) {
        msg.textContent = "Nothing played yet — type the example into your .js file, save (⌘S), and reload.";
      }
    });
  }

  if (doneBtn) {
    doneBtn.addEventListener("click", function () {
      if (msg) { msg.textContent = ""; }
      var problem = runUserCode(window.playDone, "(the finished version is missing)");
      if (problem && msg) { msg.textContent = "⚠️ " + problem; }
    });
  }

  if (stopBtn) {
    stopBtn.addEventListener("click", function () {
      stopAll();
      if (msg) { msg.textContent = "⏹ Stopped."; }
    });
  }
}

document.addEventListener("DOMContentLoaded", wireLesson);

// If a lesson .js file has a typo it won't load at all — show a friendly hint.
window.addEventListener("error", function (e) {
  var msg = document.querySelector(".msg");
  if (msg && e && e.message) {
    msg.textContent = "⚠️ " + e.message + "  (fix your .js file, save, and reload)";
  }
});
