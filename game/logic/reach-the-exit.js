// 🏁 REACH THE EXIT — the win rule. Landing on the green exit wins the game.
// (This used to be built into the engine; now winning is a card like everything else.)
registerCard({
  name: "Reach the Exit",
  whatItDoes: "Get to the green exit square to win.",
  limit: "If there's a boss, you must beat it first.",

  // "when the player moves" — did we land on the exit?
  onMove(player, game) {
    if (game.isGoal(player)) {
      game.win("You reached the exit! 🧟 beaten.");
    }
  },
});
