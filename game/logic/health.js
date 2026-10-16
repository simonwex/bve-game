// ❤️ HEALTH  —  the card we build together.
// It uses three big ideas: a VARIABLE, a bit of MATH, and an IF.
registerCard({
  name: "Health",
  whatItDoes: "You start with some health and lose it when a zombie gets you.",
  limit: "At 0 health, it's game over.",

  // "when 🚩 clicked" — set your starting health.
  start(game) {
    game.health = 5;                       // ← change this number
  },

  // "when touching zombie" — lose some health, then check if you're done.
  onZombieHit(game) {
    game.health = game.health - 1;         // ← the math: take 1 away
    if (game.health <= 0) {                // ← the if: is it zero yet?
      game.lose("The zombies got you!");
    }
  },

  // how Health shows itself at the top of the screen
  hud(game) {
    return "❤️".repeat(Math.max(0, game.health));
  },
});
