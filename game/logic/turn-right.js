// A MOVEMENT CARD (provided).
registerCard({
  name: "Turn Right",
  whatItDoes: "Spin a quarter-turn to the right.",
  limit: "You turn, but you don't move.",
  key: "ArrowRight",                     // press → to use this card

  use(player, game) {
    return {
      x: player.x,
      y: player.y,
      facing: game.rotateRight(player.facing),
    };
  },
});
