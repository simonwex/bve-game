// ============================================================
//  COPY ME to make a new card!
//  1. Copy this file and rename it, e.g.  logic/score.js
//  2. Fill in the name and the blanks.
//  3. Keep ONLY the hooks your mechanic needs (delete the rest).
//  4. Add one line in index.html:  <script src="logic/score.js"></script>
// ============================================================
registerCard({
  name: "My Mechanic",
  whatItDoes: "Say what it does.",
  limit: "Say what keeps it fair.",

  // Pick the hooks you need — the machine calls them at the right moment:

  // A) A button the player can press:
  // use(player, game) {
  //   return player;                         // return where the player ends up
  // },

  // B) Set a starting value when the game begins ("when 🚩 clicked"):
  // start(game) {
  //   game.health = 3;
  // },

  // C) React when the player steps on a zombie ("when touching zombie"):
  // onZombieHit(game) {
  //   game.health = game.health - 1;
  // },

  // D) Do something every second:
  // everySecond(game) {
  //   game.timeLeft = game.timeLeft - 1;
  // },

  // E) Show something at the top of the screen (for score/health/time cards):
  // hud(game) {
  //   return "⭐ " + game.score;
  // },

  // Advanced (for fancier cards — see logic/README.md):
  //   key: "a"                          // a keyboard shortcut for a use() card (" " = spacebar)
  //   onMove(player, game) { }          // after the player moves to a new square
  //   onAttack(player, target, game) { }// return false to cancel an attack
  //   blocksMove(from, to, game) { }    // return true to block a move
});
