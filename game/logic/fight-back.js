// ⚔️ FIGHT BACK — the card we build together.
// It uses all three big ideas: a VARIABLE, a bit of MATH, and an IF.
registerCard({
  name: "Fight Back",
  whatItDoes: "Swing at the zombie in front of you. Zombies take 2 hits.",
  limit: "You stay put when you swing.",
  key: "a",                                // press A to swing

  // 1) a VARIABLE — give every zombie some health to start.
  start(game) {
    game.zombies.forEach(function (z) {
      z.hp = 2;                            // ← try 3 for tougher zombies
    });
  },

  // when you press Attack (A): hit the square in front of you.
  use(player, game) {
    const target = game.squareInFront(player);   // the square you're facing
    const z = game.zombieAt(target);             // is a zombie there?
    if (z) {
      z.hp = z.hp - 1;                           // 2) CHANGE it — knock off one hit
      if (z.hp <= 0) {                           // 3) an IF — out of health?
        game.removeZombieAt(target);             //    → it's gone
      }
    }
    return player;                               // you don't move
  },
});
