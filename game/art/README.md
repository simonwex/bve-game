# art/ — how it looks

**Art** is one of your four stats from Week 1. It's *how the game looks*.

One file per character, each dead simple for now — an emoji and a colour:

```js
registerArt("player", { emoji: "🧑", color: "#ff8c42" });
```

The machine looks up three characters: `player`, `zombie`, `boss`. Change an emoji
here, reload, and the board changes. (Later weeks: real sprites, backgrounds, and more.)
