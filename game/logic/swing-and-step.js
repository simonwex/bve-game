// ⚔️ SWING & STEP — you can't attack twice from the same square.
// You must move to a new square between strikes.
// Needs: the Attack card.
//
// It remembers whether you've already swung from where you're standing, so it
// lives in its own little bubble to keep that memory private.
(function () {
  let alreadyStruckHere = false;

  registerCard({
    name: "Swing & Step",
    whatItDoes: "One strike per square — move to a new square before you can attack again.",
    limit: "Needs the Attack card.",

    // "when the player attacks" — return false to cancel the strike.
    onAttack(player, target, game) {
      if (alreadyStruckHere) {
        game.message("Move to a new square before you strike again!");
        return false;                    // cancel this attack
      }
      alreadyStruckHere = true;           // used up this square's swing
      return true;                        // allow the strike
    },

    // "when the player moves" — a fresh square means a fresh swing.
    onMove(player, game) {
      alreadyStruckHere = false;
    },
  });
})();
