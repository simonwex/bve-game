// A MOVEMENT CARD (provided). Turning changes the way you FACE, not where you are.
registerCard({
  name: "Turn Left",
  whatItDoes: "Spin a quarter-turn to the left.",
  limit: "You turn, but you don't move.",
  key: "ArrowLeft",                      // press ← to use this card

  use(player, game) {
    return {
      x: player.x,
      y: player.y,
      facing: game.rotateLeft(player.facing),
    };
  },
});
