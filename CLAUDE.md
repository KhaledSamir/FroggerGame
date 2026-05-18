# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start Vite dev server (http://localhost:5173)
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build locally
```

## Architecture

The game is a TypeScript + Vite project with ES modules. No globals — all dependencies are injected.

**Entry point:** `src/main.ts` grabs `#score` from the DOM and instantiates `Engine`, which owns the entire lifecycle.

**Module layout:**
- `src/constants.ts` — canvas size, tile dimensions, grid shape, collision threshold
- `src/types.ts` — `IEntity` interface (`update(dt)` + `render(ctx)`), `Direction` enum
- `src/resources.ts` — `ResourceLoader` singleton (`Resources`); image cache; `onReady` callback fires once all images are loaded
- `src/entities/enemy.ts` — `Enemy implements IEntity`; resets to origin x when it exits the right edge
- `src/entities/player.ts` — `Player implements IEntity`; `score` property updated on `reset(collision)`
- `src/engine.ts` — `Engine`; creates canvas, runs the `requestAnimationFrame` loop, calls `Resources.load` + `Resources.onReady`, handles keyboard input, owns collision detection and score DOM updates

**Game loop flow:** `Engine` constructor → `Resources.load(sprites)` → `Resources.onReady` → `init()` → `main()` → `requestAnimationFrame` loop calling `update(dt)` + `render()`.

**Collision detection** is in `Engine.checkCollisions()` using Euclidean distance (threshold: `COLLISION_THRESHOLD = 30px`). On hit, calls `player.reset(true)`.

**Scoring:** `Player.reset(false)` → `+5` (reached water row, `y < 0`); `Player.reset(true)` → `-5` (collision). `Engine.update()` syncs `player.score` to the `#score` DOM element each tick.

**Grid layout:** Canvas is 505×606px. Tiles are 101×83px. The board is 6 rows × 5 cols: row 0 = water, rows 1–3 = stone (enemy lanes), rows 4–5 = grass (player start).

**Enemy spawning:** Three enemies at y=50, 135, 220 with speed = y×2. They reset to their origin x when they exit the right edge.
