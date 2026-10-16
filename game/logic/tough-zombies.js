// 🧟 TOUGH ZOMBIES — zombies take TWO hits to kill instead of one.
// Needs: the Attack card (so you can actually hit them).
registerCard({
  name: "Tough Zombies",
  whatItDoes: "Every zombie takes two hits to knock out.",
  limit: "Needs the Attack card. The hit-count shows on each zombie.",

  // "when 🚩 clicked" — give every zombie 2 health.
  start(game) {
    game.zombies.forEach(function (z) {
      z.hp = 2;                         // ← change this for tougher/weaker zombies
    });
  },
});
