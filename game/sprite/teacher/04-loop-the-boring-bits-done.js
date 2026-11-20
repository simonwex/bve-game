// ✅ FINISHED — 04 · Loop the boring bits (same journey, way less typing)
// A loop does forward() again and again, so you don't have to write it out.
function walkDone() {
  for (var i = 0; i < 5; i = i + 1) { 
    forward(); 
  }   // up the left side
  
  turnRight();                                        // face right
  
  for (var i = 0; i < 8; i = i + 1) {   // across the field
    forward(); 
  } 
}
