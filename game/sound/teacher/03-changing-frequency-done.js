// Finished version — the ▶ Finished button plays this, and it's shown as the example.
function playDone() {
  for (let f = 200; f < 900; f = f + 40) {
    tone(f, 20);
  }
}
