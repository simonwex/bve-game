// 🧟 PATIENT ZOMBIES — a zombie only hits you AFTER you've stood next to it
// for a whole second (one second is a warning; the next second it strikes).
// Needs: the Health card.  Conflict: don't load with "Zombie Strike".
//
// This card remembers something between seconds, so it's wrapped in its own
// little bubble ( the (function(){ ... })() ) to keep that memory private.
(function () {
  let wasAdjacentLastSecond = false;

  registerCard({
    name: "Patient Zombies",
    whatItDoes: "A zombie hits you only if you've been next to it for a full second.",
    limit: "Needs the Health card. One second next to a zombie is a warning.",

    everySecond(game) {
      if (game.health === undefined) return;
      const adjacentNow = game.isAdjacentToZombie(game.player);
      if (adjacentNow && wasAdjacentLastSecond) {       // next to one two ticks in a row
        game.health = game.health - 1;
        if (game.health <= 0) game.lose("The zombies got you!");
      }
      wasAdjacentLastSecond = adjacentNow;
    },
  });
})();
