// ✅ FINISHED — 05 · Follow a route (the whole journey is just a LIST)
// Numbers = how many steps to walk. "R" = turn right. "L" = turn left.
function walkDone() {
  var route = [5, "R", 8, "R"];

  for (var i = 0; i < route.length; i = i + 1) {
    var move = route[i];
    if (move === "R") {
      turnRight();
    } 
    else if (move === "L") {
      turnLeft();
    } 
    else {
      for (var s = 0; s < move; s = s + 1) { 
        forward(); 
      }
    }
  }
}
