// Finished version — the ▶ Finished button plays this, and it's shown as the example.
function playDone() {
  const song = [262, 330, 392, 523];
  for (const hz of song) {
    tone(hz, 220);
  }
}
