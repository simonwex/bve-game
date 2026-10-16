// ⏱ TIMER  —  a countdown. A great "do it yourself" card.
registerCard({
  name: "Timer",
  whatItDoes: "A countdown — reach the exit before it runs out.",
  limit: "At 0 seconds, it's game over.",

  // "when 🚩 clicked" — put seconds on the clock.
  start(game) {
    game.timeLeft = 45;                        // ← change this number
  },

  // "every second" — take 1 off the clock, then check it.
  everySecond(game) {
    game.timeLeft = game.timeLeft - 1;
    if (game.timeLeft <= 0) {
      game.lose("Time's up!");
    }
  },

  // how the Timer shows itself at the top of the screen
  hud(game) {
    return "⏱ " + game.timeLeft;
  },
});
