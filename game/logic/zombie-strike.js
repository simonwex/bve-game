// 🧟 ZOMBIE STRIKE — every second, any zombie next to you hits you.
// Needs: the Health card.  Conflict: don't load with "Patient Zombies".
registerCard({
  name: "Zombie Strike",
  whatItDoes: "Each second, every zombie right next to you takes 1 health.",
  limit: "Needs the Health card. Standing next to zombies is dangerous!",

  everySecond(game) {
    if (game.health === undefined) return;              // nothing to lose without Health
    const biters = game.adjacentZombies(game.player).length;
    if (biters > 0) {
      game.health = game.health - biters;               // one hit per neighbour
      if (game.health <= 0) game.lose("The zombies got you!");
    }
  },
});
