# Pixel Dash — Game Concept

## Overview

**Pixel Dash** is a 2D pixel-art platformer built with Pixi.js, designed as a demonstration of the Game CMS capabilities. The player controls one of several characters, running and jumping through trap-filled rooms, collecting fruits for score, and reaching the end flag. All game content — characters, traps, items, rooms, levels, and UI — is managed entirely through the CMS dashboard, requiring zero code changes to update.

The game uses the **"Pixel Adventure"** asset pack (by hipixelfrog) — a complete pixel-art platformer kit with characters, terrain, traps, items, and UI elements.

### Why This Genre

- **Visually dynamic**: animated characters, tiled terrain, colorful backgrounds — ideal for a thesis defense presentation.
- **Content-driven**: every gameplay element (rooms, traps, items, characters) is data, not code.
- **Simple mechanics**: the audience can immediately understand what is happening.
- **Natural asset usage**: spritesheets for characters, terrain, and items; Spine animations as an alternative character renderer; bitmap fonts for UI — each CMS asset type is exercised for its real-world purpose.
- **No combat system needed**: traps and platforming provide challenge without requiring AI or hit detection complexity.

## Core Gameplay

1. **Title screen** displays the game name rendered with a CMS-managed bitmap font. The selected hero idles on screen.
2. **The player starts a run.** The game fetches the level entity from the CMS, which defines an ordered sequence of rooms.
3. **The hero runs and jumps** through each room. The player controls movement and jumping via keyboard/tap.
4. **Rooms** are built from a terrain tileset on a colored background. They contain traps (saws, spikes, fire, falling platforms), collectible fruits, breakable boxes, and checkpoints.
5. **Traps** deal damage on contact. Each trap type has CMS-defined behavior (static, moving, triggered) and damage values.
6. **Fruits** grant score points when collected. Boxes can be hit to break and reveal bonus items.
7. **Checkpoints** save progress within a room. The start flag marks the spawn point; the end flag completes the room.
8. **The run ends** when the hero reaches the final room's end flag or loses all HP. A score screen displays results.

## Asset Pack Contents

### Characters (Spritesheet Frame Strips)

Four playable characters, each with 7 animation states at 32x32 pixels per frame:

| Character       | Style                          |
| --------------- | ------------------------------ |
| **Ninja Frog**  | Green frog with ninja headband |
| **Mask Dude**   | Masked character               |
| **Pink Man**    | Pink character                 |
| **Virtual Guy** | Blue virtual character         |

**Animation states**: Idle, Run, Jump, Fall, Double Jump, Hit, Wall Jump
**Shared effects**: Appearing (96x96), Disappearing (96x96) — spawn/despawn

Additionally, the CMS-bundled **spineboy** Spine animation can serve as an alternative hero, demonstrating the Spine asset pipeline alongside spritesheets.

### Terrain

`Terrain (16x16).png` — a tileset atlas containing 12+ terrain themes:

| Theme          | Visual                   |
| -------------- | ------------------------ |
| Stone          | Gray stone blocks        |
| Grass          | Green grass on dirt      |
| Dirt           | Brown earth              |
| Brick          | Red brick wall           |
| Sand           | Yellow sand              |
| Wood           | Brown planks             |
| Crystal        | Teal/cyan crystal        |
| Lava           | Orange/red with drips    |
| Gold           | Yellow metallic          |
| Purple crystal | Purple variant           |
| And more...    | Various decorative tiles |

Each theme provides corner, edge, and fill tiles for building complete room geometry on a 16x16 grid.

### Backgrounds

Seven solid-color tiling backgrounds: Blue, Brown, Gray, Green, Pink, Purple, Yellow.

### Traps (13 Types)

| Trap                 | Size  | Behavior              | Animation States              |
| -------------------- | ----- | --------------------- | ----------------------------- |
| **Spikes**           | 16px  | Static                | Idle                          |
| **Saw**              | 38x38 | Moving (on chain)     | Off, On                       |
| **Fire**             | 16x32 | Triggered             | Off, On, Hit                  |
| **Arrow**            | 18x18 | Projectile            | Idle, Hit                     |
| **Rock Head**        | 42x42 | Moving (Thwomp-style) | Idle, Blink, directional Hits |
| **Spike Head**       | 54x52 | Moving (Thwomp-style) | Idle, Blink, directional Hits |
| **Falling Platform** | 32x10 | Triggered (collapse)  | Off, On                       |
| **Fan**              | 24x8  | Static (wind push)    | Off, On                       |
| **Trampoline**       | 28x28 | Triggered (bounce)    | Idle, Jump                    |
| **Spiked Ball**      | —     | Moving (swinging)     | Ball, Chain                   |
| **Blocks**           | 22x22 | Destructible          | Idle, HitSide, HitTop, Parts  |
| **Moving Platform**  | 32x8  | Moving (patrol)       | Off, On (Brown/Grey), Chain   |
| **Sand/Mud/Ice**     | 16x6  | Surface modifier      | Texture, Particles            |

### Items

**Fruits** (9 types, animated sprite strips): Apple, Bananas, Cherries, Kiwi, Melon, Orange, Pineapple, Strawberry + Collected effect

**Boxes** (3 types): Box1, Box2, Box3 — each with Idle, Hit (28x24), Break animations

**Checkpoints**: Start flag (Idle, Moving), Checkpoint flag (Idle, Out, No Flag), End flag (Idle, Pressed) — all at 64x64

### UI / Menu

- **11 buttons**: Play, Restart, Back, Close, Next, Previous, Settings, Volume, Levels, Leaderboard, Achievements
- **50 level selection thumbnails**: numbered 01–50
- **Pixel bitmap font**: `Text (White) (8x10).png`, `Text (Black) (8x10).png` — monospaced pixel font atlas

### Effects

Confetti (16x16), Dust Particle, Shadow, Transition

---

## CMS Entity Definitions

### `game-config` (singleton)

Global settings for the game. A single instance configures the entire game.

| Field           | Component Type            | Description                              |
| --------------- | ------------------------- | ---------------------------------------- |
| `title`         | `text`                    | Game title displayed on the title screen |
| `titleFont`     | `bitmapFont`              | Bitmap font used for the title           |
| `heroRef`       | `entityReference → hero`  | The active hero character                |
| `startingLevel` | `entityReference → level` | The default level to play                |
| `gravity`       | `number`                  | Gravity strength for physics             |
| `jumpForce`     | `number`                  | Default jump impulse magnitude           |
| `defaultLives`  | `number`                  | Starting lives count                     |

### `hero`

A playable character. Uses an `alternative` component to support **either** spritesheet-based or Spine-based rendering — demonstrating both CMS asset pipelines in one entity.

| Field                 | Component Type                        | Description                                                                         |
| --------------------- | ------------------------------------- | ----------------------------------------------------------------------------------- |
| `name`                | `text`                                | Character display name (e.g., "Ninja Frog")                                         |
| `animation`           | `alternative`                         | Choose rendering mode:                                                              |
| — option A: `sprites` | `assetWrapper` with `spritesheetStep` | Upload frame strip PNGs (Idle, Run, Jump, Fall, Hit, etc.) → auto-packed into atlas |
| — option B: `spine`   | `spine`                               | Spine skeleton (e.g., spineboy) with idle, run, jump animations                     |
| `frameWidth`          | `number`                              | Sprite frame width in pixels (32 for pixel-art characters)                          |
| `frameHeight`         | `number`                              | Sprite frame height in pixels (32 for pixel-art characters)                         |
| `stats`               | `compose`                             | Structured stats block                                                              |
| `stats.hp`            | `number`                              | Maximum health points                                                               |
| `stats.speed`         | `number`                              | Horizontal movement speed                                                           |
| `stats.jumpForce`     | `number`                              | Jump impulse (overrides game-config default)                                        |

The four pixel-art characters (Ninja Frog, Mask Dude, Pink Man, Virtual Guy) use the spritesheet option. The bundled **spineboy** uses the Spine option — same entity type, different rendering pipeline.

### `trap`

A hazard that can be placed in rooms. Each trap type is a separate entity.

| Field         | Component Type                        | Description                                      |
| ------------- | ------------------------------------- | ------------------------------------------------ |
| `name`        | `text`                                | Trap name (e.g., "Saw", "Fire", "Spikes")        |
| `sprites`     | `assetWrapper` with `spritesheetStep` | Trap animation frame PNGs → auto-packed atlas    |
| `frameWidth`  | `number`                              | Frame width in pixels                            |
| `frameHeight` | `number`                              | Frame height in pixels                           |
| `damage`      | `number`                              | Damage dealt on contact                          |
| `behavior`    | `dropdown`                            | Behavior type: `static`, `moving`, `triggered`   |
| `moveRange`   | `number`                              | Movement range in pixels (for `moving` behavior) |
| `moveSpeed`   | `number`                              | Movement speed (for `moving` behavior)           |

### `item`

A collectible item — fruits for score, boxes as destructible containers.

| Field         | Component Type                        | Description                                            |
| ------------- | ------------------------------------- | ------------------------------------------------------ |
| `name`        | `text`                                | Item name (e.g., "Apple", "Box1")                      |
| `sprites`     | `assetWrapper` with `spritesheetStep` | Item animation frame PNGs → auto-packed atlas          |
| `frameWidth`  | `number`                              | Frame width in pixels                                  |
| `frameHeight` | `number`                              | Frame height in pixels                                 |
| `effect`      | `dropdown`                            | Effect type: `score`, `heal`, `speed_boost`, `destroy` |
| `value`       | `number`                              | Effect magnitude (score points, heal amount, etc.)     |

### `room`

A single platformer room/section. Rooms are the building blocks of levels.

| Field          | Component Type                        | Description                                                                    |
| -------------- | ------------------------------------- | ------------------------------------------------------------------------------ |
| `name`         | `text`                                | Room name (e.g., "Forest Start", "Lava Bridge")                                |
| `background`   | `dropdown`                            | Background color: `Blue`, `Brown`, `Gray`, `Green`, `Pink`, `Purple`, `Yellow` |
| `terrain`      | `assetWrapper` with `spritesheetStep` | Terrain tileset (16x16 tiles) → auto-packed atlas                              |
| `layout`       | `text`                                | JSON string defining tile grid placement (row/col → tile index)                |
| `traps`        | `repeatable` of `compose`             | Trap placement definitions                                                     |
| `traps[].trap` | `entityReference → trap`              | Which trap type to place                                                       |
| `traps[].x`    | `number`                              | X position in pixels                                                           |
| `traps[].y`    | `number`                              | Y position in pixels                                                           |
| `items`        | `repeatable` of `compose`             | Item placement definitions                                                     |
| `items[].item` | `entityReference → item`              | Which item type to place                                                       |
| `items[].x`    | `number`                              | X position in pixels                                                           |
| `items[].y`    | `number`                              | Y position in pixels                                                           |
| `width`        | `number`                              | Room width in tiles                                                            |
| `height`       | `number`                              | Room height in tiles                                                           |

### `level`

A complete level composed of an ordered sequence of rooms.

| Field       | Component Type                           | Description                                     |
| ----------- | ---------------------------------------- | ----------------------------------------------- |
| `name`      | `text`                                   | Level name (e.g., "Forest World", "Lava Caves") |
| `rooms`     | `repeatable` of `entityReference → room` | Ordered sequence of rooms                       |
| `uiFont`    | `bitmapFont`                             | Bitmap font for in-game HUD (score, HP, lives)  |
| `scoreFont` | `bitmapFont`                             | Bitmap font for the results screen              |
| `thumbnail` | `assetWrapper` with `spritesheetStep`    | Level selection thumbnail image                 |

---

## Entity Relationship Graph

```
game-config
  ├── heroRef ──────────► hero (spritesheet OR Spine animation + stats)
  └── startingLevel ────► level
                            ├── uiFont ──► bitmapFont
                            ├── scoreFont ► bitmapFont
                            └── rooms[] ──► room
                                             ├── terrain ──► spritesheet (tileset)
                                             ├── traps[].trap ──► trap (spritesheet + behavior)
                                             └── items[].item ──► item (spritesheet + effect)
```

---

## CMS Asset Type Usage

### Spritesheets (via Asset Pipeline)

The primary asset type for this game. Individual PNG frame strips are uploaded to the CMS, which automatically packs them into optimized texture atlases using the maxRects algorithm.

| Usage           | Source Assets                                                                         | Description                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Hero characters | 7 frame strip PNGs per character (Idle, Run, Jump, Fall, Hit, Double Jump, Wall Jump) | Each strip is a horizontal sequence of 32x32 frames. The game client slices the packed atlas into `AnimatedSprite` frames. |
| Trap animations | 2–6 PNGs per trap type (Off, On, Hit, directional states)                             | Frame strips at various sizes (18x18 to 54x52).                                                                            |
| Item animations | 1–3 PNGs per item (Idle, Hit, Break for boxes; animated strip for fruits)             | Fruits are animated strips; boxes have state-based sprites.                                                                |
| Terrain tileset | Single `Terrain (16x16).png` atlas                                                    | Multi-theme tileset with corner/edge/fill tiles for building room geometry.                                                |
| UI elements     | Button PNGs, level thumbnails                                                         | Static sprites for menu rendering.                                                                                         |

### Spine Animations

Used as an **alternative rendering mode** for hero characters, demonstrating the CMS's Spine pipeline alongside spritesheets.

| Usage            | Description                                                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alternative hero | The bundled **spineboy** Spine skeleton serves as an alternative playable character. Same `hero` entity type, different animation component via `alternative`. |

The game client detects which `alternative` branch is active and instantiates either a Pixi.js `AnimatedSprite` (spritesheet) or a `@esotericsoftware/spine-pixi-v8` `Spine` instance.

### Bitmap Fonts

| Usage        | Description                                                 |
| ------------ | ----------------------------------------------------------- |
| Title screen | Game title rendered with a CMS-managed bitmap font          |
| In-game HUD  | Score counter, HP display, lives — rendered as `BitmapText` |
| Score screen | Final results in a potentially different font style         |

The asset pack includes pixel font sheets (`Text (White/Black) (8x10).png`) that can be converted to bitmap fonts, or proper SDF fonts can be uploaded separately through the CMS.

### Other Components

| Component         | Usage                                                                      |
| ----------------- | -------------------------------------------------------------------------- |
| `text`            | Entity names, game title, room layout JSON                                 |
| `number`          | Stats, physics params, positions, dimensions                               |
| `dropdown`        | Trap behavior, item effect type, background color                          |
| `compose`         | Grouping related fields (stats, placement definitions)                     |
| `repeatable`      | Variable-length lists (rooms in a level, traps in a room, items in a room) |
| `entityReference` | Linking entities (room → trap, level → room, config → hero)                |
| `alternative`     | Choosing between spritesheet and Spine rendering for heroes                |
| `assetWrapper`    | Wrapping raw images with the spritesheet pipeline step                     |

---

## Game Client Architecture

```
1. Fetch game-config (published variant)
   │
2. Resolve entity references:
   ├── Fetch hero → detect alternative branch (spritesheet or Spine)
   │   ├── Spritesheet: get atlas URLs + frame dimensions
   │   └── Spine: get skeleton JSON, atlas, texture URLs
   └── Fetch level → get room references + font data
       │
3. For each room reference:
   └── Fetch room → get background color, terrain spritesheet, layout JSON
       ├── Fetch each trap → get spritesheet URLs + behavior config
       └── Fetch each item → get spritesheet URLs + effect config
           │
4. Load all assets in parallel via Pixi Assets.load():
   ├── Character spritesheet atlas OR Spine skeleton
   ├── Trap/item spritesheet atlases
   ├── Terrain tileset atlas
   └── Bitmap font pages + descriptors
       │
5. Build Pixi scene:
   ├── Tiling background (colored)
   ├── Terrain tiles placed according to layout JSON
   ├── AnimatedSprite or Spine instance for hero
   ├── AnimatedSprites for traps (with behavior scripts)
   ├── AnimatedSprites for items (with collection logic)
   ├── Checkpoint flags
   └── BitmapText for HUD
       │
6. Game loop (Pixi ticker):
   ├── Player input → movement, jumping
   ├── Physics (gravity, collision with terrain tiles)
   ├── Trap behavior (moving, triggered, static damage zones)
   ├── Item collection (score, effects)
   ├── Checkpoint tracking
   └── Room transition on reaching end flag
```

The client uses the CMS type-safe API client, so all entity data is fully typed in TypeScript. No hardcoded asset paths — everything is resolved from entity data at runtime.

---

## Demo Scenarios

These scenarios are designed for a thesis defense presentation, each demonstrating a specific CMS capability.

### Scenario A: Add a New Trap (Zero Code)

1. The game is running with existing traps (spikes, fire) in a room.
2. Open the CMS dashboard. Create a new `trap` entity: upload the Saw sprite frames (Off, On), set damage to 20, select behavior "moving", set moveRange to 200 and moveSpeed to 3.
3. Edit an existing `room` entity: add the Saw to the traps list with x/y coordinates.
4. Publish both entities.
5. Reload the game. The Saw appears in the room, moving back and forth on its patrol path.

**Demonstrates**: end-to-end content creation by a non-programmer. The spritesheet asset pipeline, entity references, and animated rendering all work together without touching code.

### Scenario B: Live Balance Tuning

1. The fire trap deals 30 damage, killing the hero in 2 hits.
2. In the CMS, edit the fire trap entity: reduce damage from 30 to 10. Publish.
3. Reload the game. The same fire trap now only tickles — the hero survives 6 hits.

**Demonstrates**: game balance parameters are CMS-managed data, not hardcoded values.

### Scenario C: Swap Hero Character

1. The hero is Ninja Frog (spritesheet-based).
2. In the CMS, edit the `game-config` entity: change `heroRef` to point to the "Spineboy" hero entity (which uses the Spine alternative branch).
3. Publish and reload. The hero is now the spineboy Spine animation — completely different rendering pipeline, same game logic.

**Demonstrates**: the `alternative` component allows the same entity type to use different asset pipelines. The game seamlessly switches between spritesheet and Spine rendering based on CMS data.

### Scenario D: Change Background & Terrain Theme

1. A room uses the Blue background with the grass terrain theme.
2. In the CMS, edit the room: change background dropdown to "Pink", upload a different terrain tileset slice (e.g., lava theme tiles).
3. Publish and reload. The room now has a pink background with lava-themed terrain — completely different visual atmosphere.

**Demonstrates**: visual theming is CMS-managed. Background color via dropdown, terrain via spritesheet upload.

### Scenario E: Rearrange Level Layout

1. The level plays rooms in order: Forest Start → Cave Bridge → Mountain Peak.
2. In the CMS, edit the level's `rooms` repeatable: reorder to Mountain Peak → Forest Start, removing Cave Bridge entirely.
3. Publish and reload. The level plays in the new order with one fewer room.

**Demonstrates**: structural content changes (not just parameter tweaks) through the CMS via entity references and repeatable containers.

### Scenario F: Add a New Fruit Item (Zero Code)

1. The game has Apples and Cherries as collectibles.
2. In the CMS, create a new `item` entity: upload the Strawberry sprite strip, set effect to "score", value to 50.
3. Edit a room: add Strawberry placements at various x/y positions. Publish.
4. Reload. Strawberries appear in the room with their animated sprite, granting 50 points on collection.

**Demonstrates**: the spritesheet pipeline end-to-end — upload raw frame strip PNGs, CMS packs them into an atlas, game renders them as `AnimatedSprite`.

### Scenario G: Draft/Publish Workflow

1. A content editor creates a new trap entity (Spiked Ball) but leaves it in draft state.
2. The game (fetching published entities) does not see the draft trap.
3. The editor publishes the entity and adds it to a room. Now the game fetches and displays it.

**Demonstrates**: the draft/publish workflow prevents incomplete or unapproved content from reaching the live game — a real production concern.

### Scenario H: Change UI Font

1. The in-game score displays in a plain bitmap font.
2. In the CMS, edit the level's `uiFont` bitmap font: upload a new font with a different typeface and size.
3. Publish and reload. The HUD now uses the new font.

**Demonstrates**: even UI presentation assets are CMS-managed and swappable without code changes.
