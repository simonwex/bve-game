# sound/ — the Sound Lab

**Sound** is one of your four stats from Week 1 — *the music and the effects*: a step sound,
a "caught!" groan, win music.

This folder is a hands-on lesson for making sound with JavaScript. **Open `index.html`** in
Chrome (just double-click it) and work through the five steps:

1. `01-one-tone.html` — a tone is one line of code
2. `02-intermittent-beep.html` — your first **loop** (do it again and again)
3. `03-changing-frequency.html` — a loop where the number changes each time (a slide)
4. `04-arrays-make-a-tune.html` — a list of pitches (an **array**) + a loop = a tune
5. `05-make-a-sound-effect.html` — put it together; build your own effect

**How a step works.** Each page shows an **example** (the finished code) in a dark box. The
student **types that example into the matching `.js` file** (e.g. `02-intermittent-beep.js`,
inside the `play()` function), presses **⌘S** to save, reloads the page (**⌘R**), and presses
**▶ Play mine** to hear their own version. Their `.js` file is their saved work — it's theirs
to keep.

**Buttons:** ▶ Play mine runs the student's `play()`. ⏹ Stop silences everything instantly.
▶ Finished version runs the complete code in `teacher/*-done.js` — handy for the teacher to demo
the target sound without typing, or for a stuck kid to hear the answer. (The finished versions
live in `teacher/` so they're not sitting right next to the student files.)

**Sounds are pitches in Hz** (bigger number = higher). A melody is just a list of numbers — no
note names to memorize. A nice scale to pick from: `262, 294, 330, 349, 392, 440, 494, 523`.

**Safety:** the lab won't let a sound run longer than ~10 seconds (one sound is capped at 2
seconds), so adding extra zeros can't make it play forever — you just get a friendly "try smaller
numbers" message, and the loop stops. (A loop with *no* sound in it that never ends can still
freeze the page — if that happens, close the tab and reopen it.)

**Files:** `sound.js` is "the machine" (makes the beeps, runs the buttons — you don't edit it).
`sound.css` is the shared look. `NN-name.js` = the file the student types into.
`teacher/NN-name-done.js` = the finished version. Everything runs straight from the file, no
internet needed.
