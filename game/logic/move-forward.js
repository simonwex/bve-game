// A MOVEMENT CARD (provided). Read it to see the pattern — you don't
// have to write this kind today.
registerCard({
  name: "Move Forward",
  whatItDoes: "Step one square the way you're facing.",
  limit: "Just one square, and only forward.",
  key: " ",                              // press the spacebar to use this card

  // use() runs when the button is pressed. It returns where the player ends up.
  use(player, game) {
    return {
      x: player.x + player.facing.dx,
      y: player.y + player.facing.dy,
      facing: player.facing,
    };
  },
});
