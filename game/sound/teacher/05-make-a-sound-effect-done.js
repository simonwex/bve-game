// Finished version — the ▶ Finished button plays this, and it's shown as the example.
function playDone() {
  // ⚡ laser zap — a fast slide downward
  for (let f = 900; f > 200; f = f - 60) {
    tone(f, 25);
  }
}
