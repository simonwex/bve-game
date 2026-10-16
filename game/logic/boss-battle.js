// 👹 BOSS BATTLE — the boss on the exit takes 5 hits before the exit opens.
// Needs: the Attack card. Stand next to the boss, face it, and Attack.
// While the boss is alive you can't step onto the exit.
registerCard({
  name: "Boss Battle",
  whatItDoes: "The boss guards the exit and takes 5 hits to beat.",
  limit: "Needs the Attack card. You can't win until the boss is beaten.",

  // "when 🚩 clicked" — give the boss 5 health.
  start(game) {
    game.boss.hp = 5;                   // ← change this for a tougher/easier boss
  },

  // "can the player move there?" — return true to BLOCK the move.
  // While the boss is alive, it guards the exit.
  blocksMove(from, to, game) {
    if (game.isGoal(to) && game.boss.hp > 0) {
      game.message("The boss blocks the exit!");
      return true;                      // blocked
    }
  },
});
