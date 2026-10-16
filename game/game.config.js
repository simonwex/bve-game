// ================================================================
//  THE BOARD  —  this one file describes our whole game.
//  Change these numbers to make a totally different maze.
// ================================================================
//
//  Squares are counted like this:
//    x = how far ACROSS  (0 is the far-left column)
//    y = how far DOWN    (0 is the top row)
//  So {x: 0, y: 0} is the top-left square.

const GAME = {
  title: "Zombie Maze",

  cols: 5,   // how many squares across  (try changing to 6!)
  rows: 5,   // how many squares down

  // Where the player starts (the orange square) and which way they face.
  start: { x: 2, y: 4 },            // Row 4, Col 3
  startFacing: { dx: 0, dy: -1 },   // facing UP, toward the exit

  // The exit (the green square). Reach it to win. The boss stands here.
  goal: { x: 0, y: 0 },             // Row 1, Col 1

  // The zombies. Add or move them — one {x, y} per zombie.
  zombies: [
    { x: 1, y: 1 },
    { x: 2, y: 2 },
  ],
};
