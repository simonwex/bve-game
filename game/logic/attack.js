// ⚔️ ATTACK  —  a button card. Because it has use(), it shows up as a button.
registerCard({
  name: "Attack",
  whatItDoes: "Swing at the square in front of you.",
  limit: "Only the square you're facing — and you don't move.",
  key: "a",                              // press A to use this card

  use(player, game) {
    game.attack(player);   // strike the square you're facing
    return player;         // you stay put
  },
});
