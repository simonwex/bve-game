// 🧟 DEADLY TOUCH — walking INTO a zombie's square ends the game at once.
// Works on its own. If you also load Health, this wins (instant game over).
registerCard({
  name: "Deadly Touch",
  whatItDoes: "Step onto a zombie's square and it's game over instantly.",
  limit: "Don't walk into zombies — go around, or Attack first.",

  // "when touching zombie" — the player just stepped onto a zombie.
  onZombieHit(game) {
    game.lose("You walked into a zombie!");
  },
});
