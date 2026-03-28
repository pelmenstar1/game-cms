# Pixel Dash — Asset Guide

Complete reference for every asset in the `pack/` directory: what it is, its exact dimensions and frame counts, and how to use it in the game.

All assets are from the **"Pixel Adventure"** pack by hipixelfrog. Format: PNG with transparency. All animated assets are **horizontal sprite strips** (frames laid out left-to-right in a single row).

---

## Table of Contents

1. [Main Characters](#1-main-characters)
2. [Terrain](#2-terrain)
3. [Backgrounds](#3-backgrounds)
4. [Traps & Hazards](#4-traps--hazards)
5. [Items — Fruits](#5-items--fruits)
6. [Items — Boxes](#6-items--boxes)
7. [Items — Checkpoints](#7-items--checkpoints)
8. [Menu & UI](#8-menu--ui)
9. [Effects & Particles](#9-effects--particles)
10. [CMS Upload Plan](#10-cms-upload-plan)

---

## 1. Main Characters

**Location**: `pack/Main Characters/`

Four playable characters with identical animation sets. Each animation is a horizontal sprite strip at **32x32 pixels per frame**.

### Animation States (per character)

| Animation       | File                      | Total Size | Frames | Frame Size | Loop | Usage                                        |
| --------------- | ------------------------- | ---------- | ------ | ---------- | ---- | -------------------------------------------- |
| **Idle**        | `Idle (32x32).png`        | 352x32     | 11     | 32x32      | Yes  | Default state when standing still            |
| **Run**         | `Run (32x32).png`         | 384x32     | 12     | 32x32      | Yes  | Horizontal movement                          |
| **Jump**        | `Jump (32x32).png`        | 32x32      | 1      | 32x32      | No   | Single frame, shown during upward velocity   |
| **Fall**        | `Fall (32x32).png`        | 32x32      | 1      | 32x32      | No   | Single frame, shown during downward velocity |
| **Double Jump** | `Double Jump (32x32).png` | 192x32     | 6      | 32x32      | No   | Play once on double-jump input               |
| **Hit**         | `Hit (32x32).png`         | 224x32     | 7      | 32x32      | No   | Play once when taking damage                 |
| **Wall Jump**   | `Wall Jump (32x32).png`   | 160x32     | 5      | 32x32      | No   | Play once when jumping off a wall            |

### Characters

| Character       | Folder                         | Visual Description                        |
| --------------- | ------------------------------ | ----------------------------------------- |
| **Ninja Frog**  | `Main Characters/Ninja Frog/`  | Green frog with a red ninja headband      |
| **Mask Dude**   | `Main Characters/Mask Dude/`   | Orange/brown character with a tribal mask |
| **Pink Man**    | `Main Characters/Pink Man/`    | Pink round character with a cheerful face |
| **Virtual Guy** | `Main Characters/Virtual Guy/` | Blue character with VR-style goggles      |

All four characters share the exact same animation file names, frame counts, and dimensions — only the art differs. This means the game client uses one generic character renderer; the CMS entity just points to a different set of PNGs.

### Shared Character Effects

| Animation        | File                                       | Total Size | Frames | Frame Size | Usage                                                                                                     |
| ---------------- | ------------------------------------------ | ---------- | ------ | ---------- | --------------------------------------------------------------------------------------------------------- |
| **Appearing**    | `Main Characters/Appearing (96x96).png`    | 672x96     | 7      | 96x96      | Spawn-in effect (golden light materializing). Play once when the hero spawns or respawns at a checkpoint. |
| **Disappearing** | `Main Characters/Desappearing (96x96).png` | 672x96     | 7      | 96x96      | Despawn effect (golden light dissolving). Play once when the hero dies or exits a room.                   |

Note: the appearing/disappearing effects are larger (96x96) than the character (32x32). Center the effect on the character position. The effect shows a golden sparkle/light that fades to reveal (or dissolve from) the character.

### Game State Machine

```
                                ┌─────────┐
          ┌────── on ground ────┤  Idle   │◄── default
          │                     └────┬────┘
          │                          │ move input
          │                     ┌────▼────┐
          │          ┌──────────┤   Run   │──── loop
          │          │          └────┬────┘
          │     jump input      jump input
          │          │               │
          │     ┌────▼────┐    ┌────▼────┐
          │     │  Wall   │    │  Jump   │──── 1 frame
          │     │  Jump   │    └────┬────┘
          │     └────┬────┘         │ velocity < 0
          │          │         ┌────▼────┐
          │          │         │  Fall   │──── 1 frame
          │          │         └────┬────┘
          │          │              │ on ground
          │          └──────────────┼──────────► Idle
          │                         │
     hit by trap                hit by trap
          │                         │
     ┌────▼────┐               ┌────▼────┐
     │   Hit   │               │   Hit   │──── 7 frames, then:
     └────┬────┘               └────┬────┘     HP > 0 → Idle
          │                         │           HP = 0 → Disappearing
          └─────────────────────────┘
```

### CMS Upload Strategy

Each character becomes a **`hero` entity** in the CMS. Upload all 7 animation PNGs into the hero's `sprites` field (an `assetWrapper` with `spritesheetStep`). The CMS automatically packs them into a single texture atlas. The game client looks up frames by the original filename (e.g., `"Idle (32x32)"` → idle animation frames).

The Appearing/Disappearing effects are **shared across all characters** — upload them once to a shared entity or the `game-config` singleton.

---

## 2. Terrain

**Location**: `pack/Terrain/Terrain (16x16).png`
**Size**: 352x176 pixels (22 columns x 11 rows of 16x16 tiles)

This is a **tileset atlas** — a grid of 16x16 pixel tiles used to build room geometry.

### Terrain Themes

The tileset contains multiple terrain themes, each occupying a region of the atlas. Each theme provides a complete set of tiles for building platforms and walls:

| Theme              | Approximate Region | Visual                              |
| ------------------ | ------------------ | ----------------------------------- |
| **Stone**          | Top-left block     | Gray stone blocks with darker edges |
| **Grass**          | Top-center block   | Green grass tops on brown dirt      |
| **Dirt**           | Middle area        | Brown earth with organic edges      |
| **Brick**          | Right area         | Red/brown brick pattern             |
| **Metal/Gray**     | Center             | Gray metallic panels                |
| **Sand**           | Lower-left         | Yellow/beige sand                   |
| **Wood**           | Lower-center       | Brown wooden planks                 |
| **Crystal/Teal**   | Lower-left         | Teal crystalline blocks             |
| **Purple Crystal** | Lower-center       | Purple/pink crystalline blocks      |
| **Lava/Orange**    | Lower-right        | Orange with drip edges              |
| **Gold**           | Bottom-right       | Bright yellow/gold blocks           |

### Tile Types Per Theme

Each theme provides these tile variants for building geometry:

```
┌───┬───┬───┐
│ TL│ T │ TR│   TL = Top-Left corner
├───┼───┼───┤   T  = Top edge
│ L │ C │ R │   TR = Top-Right corner
├───┼───┼───┤   L  = Left edge
│ BL│ B │ BR│   C  = Center (fill)
└───┴───┴───┘   R  = Right edge
                 BL = Bottom-Left corner
                 B  = Bottom edge
                 BR = Bottom-Right corner
```

Plus additional tiles for: inner corners, single-width platforms (horizontal bars), and decorative edges.

### Game Usage

The room's `layout` JSON field defines a tile grid. Each cell references a tile index from this atlas. The game client:

1. Loads the terrain tileset from the room's `terrain` spritesheet component.
2. Parses the `layout` JSON into a 2D grid.
3. Creates a `Sprite` for each non-empty cell, using the appropriate 16x16 region of the atlas as its texture frame.
4. Uses tile coordinates for collision detection (solid tiles block movement).

### CMS Upload Strategy

Upload `Terrain (16x16).png` as-is into the room's `terrain` field (or a shared terrain entity). The game client slices it at runtime using known tile coordinates. Different rooms can use different terrain themes by referencing different tile indices in their layout JSON — all from the same atlas.

---

## 3. Backgrounds

**Location**: `pack/Background/`
**Size**: 64x64 pixels each (tiling texture)

| File         | Color        | Suggested Usage               |
| ------------ | ------------ | ----------------------------- |
| `Blue.png`   | Soft blue    | Sky / outdoor levels          |
| `Brown.png`  | Warm brown   | Cave / underground levels     |
| `Gray.png`   | Neutral gray | Stone dungeon / industrial    |
| `Green.png`  | Muted green  | Forest / swamp levels         |
| `Pink.png`   | Soft pink    | Fantasy / crystal levels      |
| `Purple.png` | Deep purple  | Night / magical levels        |
| `Yellow.png` | Warm yellow  | Desert / golden temple levels |

### Game Usage

The background tiles seamlessly to fill the entire viewport. It renders as a `TilingSprite` in Pixi.js behind all other layers.

Each background is a simple 64x64 tiling pattern — no parallax layers or gradients. The visual variety comes from pairing different backgrounds with different terrain themes.

### CMS Upload Strategy

The room entity has a `background` dropdown field selecting one of the 7 colors. The game client maps the selected color to the corresponding PNG. No need to upload backgrounds to the CMS individually — they can be bundled with the game client or uploaded once to the `game-config` entity.

### Recommended Background + Terrain Pairings

| Level Theme    | Background | Terrain Theme  | Mood             |
| -------------- | ---------- | -------------- | ---------------- |
| Forest         | Green      | Grass          | Bright, natural  |
| Cave           | Brown      | Stone          | Dark, earthy     |
| Dungeon        | Gray       | Brick          | Cold, industrial |
| Crystal Cavern | Purple     | Crystal/Teal   | Magical          |
| Lava Temple    | Brown      | Lava/Orange    | Dangerous, warm  |
| Sky Ruins      | Blue       | Stone          | Open, airy       |
| Golden Palace  | Yellow     | Gold           | Rich, ornate     |
| Candy World    | Pink       | Purple Crystal | Whimsical        |

---

## 4. Traps & Hazards

**Location**: `pack/Traps/`

Each trap type becomes a **`trap` entity** in the CMS. The content editor uploads the trap's PNG files, sets behavior and damage values, then places instances in room entities.

### 4.1 Spikes (Static Hazard)

**Location**: `pack/Traps/Spikes/`

| File       | Size  | Frames     | Description            |
| ---------- | ----- | ---------- | ---------------------- |
| `Idle.png` | 16x16 | 1 (static) | Upward-pointing spikes |

**Behavior**: Static. Deals damage on contact. Place on floors, ceilings (flipped), or walls (rotated).
**Game logic**: Pure collision check — if hero overlaps, deal damage.
**CMS config**: behavior=`static`, damage=20 (suggested).

### 4.2 Saw (Moving Hazard)

**Location**: `pack/Traps/Saw/`

| File             | Size   | Frames     | Description                  |
| ---------------- | ------ | ---------- | ---------------------------- |
| `On (38x38).png` | 304x38 | 8          | Spinning saw blade animation |
| `Off.png`        | 38x38  | 1 (static) | Saw blade not spinning       |
| `Chain.png`      | 8x8    | 1 (static) | Chain link segment           |

**Behavior**: Moving. The saw patrols back and forth along a path (horizontal or vertical). Renders chain links between the saw and its anchor point.
**Game logic**: Animate the saw spinning (`On` strip at ~12fps). Move along path defined by `moveRange`. Draw chain segments from anchor to current position. Damage on contact.
**CMS config**: behavior=`moving`, damage=25, moveRange=200, moveSpeed=2.

### 4.3 Fire (Triggered Hazard)

**Location**: `pack/Traps/Fire/`

| File              | Size  | Frames     | Description                 |
| ----------------- | ----- | ---------- | --------------------------- |
| `On (16x32).png`  | 48x32 | 3          | Fire burning animation      |
| `Off.png`         | 16x32 | 1 (static) | Extinguished fire pit       |
| `Hit (16x32).png` | 64x32 | 4          | Fire being hit/extinguished |

**Behavior**: Triggered (timed cycle). Fire alternates between On and Off states on a timer.
**Game logic**: Cycle between Off (safe) → On (dangerous) on a configurable interval. When on, loop the 3-frame `On` animation and deal damage on contact. Play the `Hit` animation during the transition.
**CMS config**: behavior=`triggered`, damage=15.

### 4.4 Arrow (Projectile Hazard)

**Location**: `pack/Traps/Arrow/`

| File               | Size   | Frames | Description                                |
| ------------------ | ------ | ------ | ------------------------------------------ |
| `Idle (18x18).png` | 180x18 | 10     | Arrow flying animation (spinning/tumbling) |
| `Hit (18x18).png`  | 72x18  | 4      | Arrow impact/break animation               |

**Behavior**: Projectile. Arrows fire from a wall or launcher at regular intervals, fly horizontally, and break on contact with terrain or the hero.
**Game logic**: Spawn arrow at launcher position, animate with `Idle` strip while flying horizontally at speed. On collision: play `Hit` animation and destroy. Damage hero on contact.
**CMS config**: behavior=`moving`, damage=10, moveSpeed=4.

### 4.5 Rock Head (Thwomp-Style Hazard)

**Location**: `pack/Traps/Rock Head/`

| File                     | Size   | Frames     | Description                        |
| ------------------------ | ------ | ---------- | ---------------------------------- |
| `Idle.png`               | 42x42  | 1 (static) | Rock face resting                  |
| `Blink (42x42).png`      | 168x42 | 4          | Blinking idle variation            |
| `Bottom Hit (42x42).png` | 168x42 | 4          | Smash animation (hitting downward) |
| `Top Hit (42x42).png`    | 168x42 | 4          | Smash animation (hitting upward)   |
| `Left Hit (42x42).png`   | 168x42 | 4          | Smash animation (hitting left)     |
| `Right Hit (42x42).png`  | 168x42 | 4          | Smash animation (hitting right)    |

**Behavior**: Moving (Thwomp pattern). Rests in idle state, occasionally blinks. When the hero is within range, slams in one direction (configurable), plays the directional Hit animation, then returns.
**Game logic**: Idle with occasional Blink. Detect hero proximity → slam in configured direction → play Hit animation → return to start. Damage on body contact during slam.
**CMS config**: behavior=`triggered`, damage=30, moveRange=150, moveSpeed=6.

### 4.6 Spike Head (Large Thwomp Variant)

**Location**: `pack/Traps/Spike Head/`

| File                     | Size   | Frames     | Description              |
| ------------------------ | ------ | ---------- | ------------------------ |
| `Idle.png`               | 54x52  | 1 (static) | Spiked rock face resting |
| `Blink (54x52).png`      | 216x52 | 4          | Blinking idle variation  |
| `Bottom Hit (54x52).png` | 216x52 | 4          | Downward smash           |
| `Top Hit (54x52).png`    | 216x52 | 4          | Upward smash             |
| `Left Hit (54x52).png`   | 216x52 | 4          | Left smash               |
| `Right Hit (54x52).png`  | 216x52 | 4          | Right smash              |

**Behavior**: Identical to Rock Head but larger and more dangerous. Spikes around all edges make it lethal from any contact direction.
**Game logic**: Same as Rock Head.
**CMS config**: behavior=`triggered`, damage=40, moveRange=180, moveSpeed=5.

### 4.7 Falling Platform

**Location**: `pack/Traps/Falling Platforms/`

| File             | Size   | Frames     | Description                               |
| ---------------- | ------ | ---------- | ----------------------------------------- |
| `Off.png`        | 32x10  | 1 (static) | Platform at rest (solid)                  |
| `On (32x10).png` | 128x10 | 4          | Platform shaking/crumbling before falling |

**Behavior**: Triggered. Appears solid until the hero stands on it. Then shakes (play `On` animation), falls, and respawns after a delay.
**Game logic**: Start as `Off` (static solid platform). When hero lands on it → play `On` animation (shake) → after animation completes, platform falls with gravity → after 3 seconds, respawn at original position.
**CMS config**: behavior=`triggered`, damage=0 (no direct damage, but falling off is lethal).

### 4.8 Fan (Wind Push)

**Location**: `pack/Traps/Fan/`

| File            | Size | Frames     | Description            |
| --------------- | ---- | ---------- | ---------------------- |
| `Off.png`       | 24x8 | 1 (static) | Fan blades at rest     |
| `On (24x8).png` | 96x8 | 4          | Fan spinning animation |

**Behavior**: Static (environmental). When active, pushes the hero upward (or in a configured direction) within a zone above the fan.
**Game logic**: When `On`, apply an upward force to the hero if they're within the fan's wind zone (a rectangular area above the fan). This creates floating/hovering sections.
**CMS config**: behavior=`static`, damage=0.

### 4.9 Trampoline (Bounce Pad)

**Location**: `pack/Traps/Trampoline/`

| File               | Size   | Frames     | Description                 |
| ------------------ | ------ | ---------- | --------------------------- |
| `Idle.png`         | 28x28  | 1 (static) | Trampoline at rest          |
| `Jump (28x28).png` | 224x28 | 8          | Trampoline bounce animation |

**Behavior**: Triggered. When the hero lands on it, launches them upward with extra force. Not a hazard — it's a helper.
**Game logic**: When hero lands on trampoline → play `Jump` animation → apply upward velocity boost (2-3x normal jump). Use for reaching high platforms.
**CMS config**: behavior=`triggered`, damage=0.

### 4.10 Spiked Ball (Swinging Hazard)

**Location**: `pack/Traps/Spiked Ball/`

| File              | Size  | Frames     | Description        |
| ----------------- | ----- | ---------- | ------------------ |
| `Spiked Ball.png` | 28x28 | 1 (static) | The spiked ball    |
| `Chain.png`       | 8x8   | 1 (static) | Chain link segment |

**Behavior**: Moving (pendulum swing). The ball swings back and forth from an anchor point, connected by chain links.
**Game logic**: Anchor point is at the placement position. Ball swings in a pendulum arc. Render chain segments between anchor and ball. Damage on ball contact.
**CMS config**: behavior=`moving`, damage=30, moveRange=120 (arc radius).

### 4.11 Moving Platforms

**Location**: `pack/Traps/Platforms/`

| File                  | Size  | Frames     | Description                          |
| --------------------- | ----- | ---------- | ------------------------------------ |
| `Brown Off.png`       | 32x8  | 1 (static) | Brown platform at rest               |
| `Brown On (32x8).png` | 256x8 | 8          | Brown platform glowing/active        |
| `Grey Off.png`        | 32x8  | 1 (static) | Grey platform at rest                |
| `Grey On (32x8).png`  | 256x8 | 8          | Grey platform glowing/active         |
| `Chain.png`           | 8x8   | 1 (static) | Chain link (for vertical attachment) |

**Behavior**: Moving (patrol). Platforms move between two points (horizontal or vertical) on a loop. The hero can ride them.
**Game logic**: Platform patrols between start and end positions. Hero sticks to the platform when standing on it (add platform velocity to hero). Two color variants for visual variety.
**CMS config**: behavior=`moving`, damage=0, moveRange=150, moveSpeed=1.

### 4.12 Destructible Blocks

**Location**: `pack/Traps/Blocks/`

| File                  | Size  | Frames     | Description              |
| --------------------- | ----- | ---------- | ------------------------ |
| `Idle.png`            | 22x22 | 1 (static) | Block intact             |
| `HitSide (22x22).png` | 66x22 | 3          | Block hit from the side  |
| `HitTop (22x22).png`  | 66x22 | 3          | Block hit from above     |
| `Part 1 (22x22).png`  | 66x22 | 3          | Debris piece 1 animation |
| `Part 2 (22x22).png`  | 66x22 | 3          | Debris piece 2 animation |

**Behavior**: Triggered. The block is solid terrain that breaks when the hero hits it from below or dashes into it from the side. Shows directional hit animation, then spawns debris particles.
**Game logic**: Render as solid tile. On hero collision from below/side → play appropriate Hit animation → spawn Part 1 and Part 2 debris sprites flying outward → remove block.
**CMS config**: behavior=`triggered`, damage=0.

### 4.13 Sand / Mud / Ice (Surface Modifiers)

**Location**: `pack/Traps/Sand Mud Ice/`

| File                      | Size   | Frames | Description                                                 |
| ------------------------- | ------ | ------ | ----------------------------------------------------------- |
| `Sand Mud Ice (16x6).png` | 176x80 | Atlas  | 3 surface overlays (sand, mud, ice) — each a strip of tiles |
| `Sand Particle.png`       | small  | 1      | Sand particle effect                                        |
| `Mud Particle.png`        | small  | 1      | Mud particle effect                                         |
| `Ice Particle.png`        | small  | 1      | Ice particle effect                                         |

**Behavior**: Static (surface modifier). Placed on top of terrain tiles to change the hero's movement physics:

- **Sand**: Slower movement speed
- **Mud**: Slower movement + reduced jump height
- **Ice**: Slippery (momentum-based movement, reduced friction)

**Game logic**: Overlay the surface strip on terrain tiles. Detect which surface the hero is standing on and modify movement physics accordingly. Emit corresponding particles when walking.
**CMS config**: Could be part of the room layout JSON rather than a separate entity.

---

## 5. Items — Fruits

**Location**: `pack/Items/Fruits/`

All fruits are animated sprite strips at **32x32 pixels per frame** with **17 frames** each (bobbing/spinning animation).

| File             | Frames | Frame Size | Visual                 | Suggested Score |
| ---------------- | ------ | ---------- | ---------------------- | --------------- |
| `Apple.png`      | 17     | 32x32      | Red apple              | 10 points       |
| `Bananas.png`    | 17     | 32x32      | Yellow banana bunch    | 10 points       |
| `Cherries.png`   | 17     | 32x32      | Red cherry pair        | 10 points       |
| `Kiwi.png`       | 17     | 32x32      | Green kiwi             | 20 points       |
| `Melon.png`      | 17     | 32x32      | Green watermelon slice | 20 points       |
| `Orange.png`     | 17     | 32x32      | Orange fruit           | 20 points       |
| `Pineapple.png`  | 17     | 32x32      | Yellow pineapple       | 30 points       |
| `Strawberry.png` | 17     | 32x32      | Red strawberry         | 30 points       |

### Collection Effect

| File            | Frames | Frame Size | Description                                           |
| --------------- | ------ | ---------- | ----------------------------------------------------- |
| `Collected.png` | 6      | 32x32      | Sparkle/pop effect played when any fruit is collected |

**Game logic**: Fruits float in place, playing their 17-frame animation on loop (~10fps). When the hero overlaps a fruit: remove the fruit sprite, play the `Collected` effect at its position, add score points.

### CMS Upload Strategy

Each fruit becomes an **`item` entity**. Upload the fruit's sprite strip PNG into the `sprites` field. Set `effect` to `score` and `value` to the point amount. The `Collected.png` effect is shared — upload once to `game-config` or bundle with the client.

---

## 6. Items — Boxes

**Location**: `pack/Items/Boxes/`

Three destructible box types. Each has an idle state, a hit animation, and a break animation. Dimensions: **28x24 pixels per frame**.

### Box1

| File              | Size   | Frames     | Description                        |
| ----------------- | ------ | ---------- | ---------------------------------- |
| `Idle.png`        | 28x24  | 1 (static) | Wooden crate with horizontal slats |
| `Hit (28x24).png` | 84x24  | 3          | Box bouncing after being hit       |
| `Break.png`       | 112x24 | 4          | Box breaking into pieces           |

### Box2

| File              | Size   | Frames     | Description                     |
| ----------------- | ------ | ---------- | ------------------------------- |
| `Idle.png`        | 28x24  | 1 (static) | Wooden crate with cross pattern |
| `Hit (28x24).png` | 84x24  | 3          | Box bouncing after being hit    |
| `Break.png`       | 112x24 | 4          | Box breaking into pieces        |

### Box3

| File              | Size   | Frames     | Description                       |
| ----------------- | ------ | ---------- | --------------------------------- |
| `Idle.png`        | 28x24  | 1 (static) | Wooden crate with diamond pattern |
| `Hit (28x24).png` | 84x24  | 3          | Box bouncing after being hit      |
| `Break.png`       | 112x24 | 4          | Box breaking into pieces          |

**Behavior**: The hero hits a box from below (like Mario hitting a `?` block) or from the side. Each box can sustain 1-3 hits (configurable). On each hit, play the `Hit` animation. On the final hit, play `Break` and spawn a reward (fruit or score bonus).

**Game logic**: Render as `Idle`. On hero headbutt/collision → play `Hit` (3 frames) → decrement hit counter. When counter reaches 0 → play `Break` (4 frames) → spawn reward item → remove box.

### CMS Upload Strategy

Each box type becomes an **`item` entity** with `effect` set to `destroy`. Upload the 3 PNGs (Idle, Hit, Break) into the `sprites` field. Set `value` to the number of hits required to break.

---

## 7. Items — Checkpoints

**Location**: `pack/Items/Checkpoints/`

Three checkpoint types that mark progress within a room.

### Start Flag

**Location**: `pack/Items/Checkpoints/Start/`

| File                         | Size    | Frames     | Description                                                  |
| ---------------------------- | ------- | ---------- | ------------------------------------------------------------ |
| `Start (Idle).png`           | 64x64   | 1 (static) | Start flag on a checkered base — yellow arrow pointing right |
| `Start (Moving) (64x64).png` | 1088x64 | 17         | Flag moving/waving animation (arrow animates)                |

**Usage**: Placed at the beginning of each room. Marks the initial spawn point. Shows the direction the player should go.
**Game logic**: Play `Moving` animation on loop. This is the hero's spawn position when entering the room.

### Mid-Level Checkpoint

**Location**: `pack/Items/Checkpoints/Checkpoint/`

| File                                | Size    | Frames     | Description                                         |
| ----------------------------------- | ------- | ---------- | --------------------------------------------------- |
| `Checkpoint (No Flag).png`          | 64x64   | 1 (static) | Empty flag pole (not yet activated)                 |
| `Checkpoint (Flag Out) (64x64).png` | 1664x64 | 26         | Flag unfurling animation (plays once on activation) |
| `Checkpoint (Flag Idle)(64x64).png` | 640x64  | 10         | Checkered flag waving (loop after activation)       |

**Usage**: Placed mid-room as respawn points. Initially shows an empty pole. When the hero touches it, the flag unfurls and begins waving.
**Game logic**: Start as `No Flag` (static). On hero contact → play `Flag Out` animation once (26 frames — the flag unfurling) → transition to `Flag Idle` loop (10 frames — flag waving). Save this position as the respawn point.

### End Flag (Trophy)

**Location**: `pack/Items/Checkpoints/End/`

| File                        | Size   | Frames     | Description                              |
| --------------------------- | ------ | ---------- | ---------------------------------------- |
| `End (Idle).png`            | 64x64  | 1 (static) | Golden trophy on a checkered base        |
| `End (Pressed) (64x64).png` | 512x64 | 8          | Trophy being pressed/activated animation |

**Usage**: Placed at the end of each room. When the hero reaches it, the room/level is complete.
**Game logic**: Render `Idle` (golden trophy). On hero contact → play `Pressed` animation (8 frames — trophy squishing down) → trigger room completion → load next room or show score screen.

### CMS Upload Strategy

Checkpoints are **not separate CMS entities** — they are part of the room's layout. The game client knows how to render Start, Checkpoint, and End from hardcoded logic. Their positions are defined in the room's `layout` JSON. The checkpoint assets can be bundled with the client or uploaded once to `game-config`.

---

## 8. Menu & UI

**Location**: `pack/Menu/`

### Buttons

**Location**: `pack/Menu/Buttons/`

All buttons are small pixel-art icons (approximately 16x16 to 20x20 pixels):

| File               | Icon                    | Usage                          |
| ------------------ | ----------------------- | ------------------------------ |
| `Play.png`         | Right-pointing triangle | Start game / resume            |
| `Restart.png`      | Circular arrow          | Restart current level          |
| `Back.png`         | Red X / back arrow      | Return to previous screen      |
| `Close.png`        | X mark                  | Close dialog / overlay         |
| `Next.png`         | Right arrow             | Next level / page              |
| `Previous.png`     | Left arrow              | Previous level / page          |
| `Settings.png`     | Gear icon               | Open settings menu             |
| `Volume.png`       | Speaker icon            | Toggle sound / volume settings |
| `Levels.png`       | Grid icon               | Open level selection           |
| `Leaderboard.png`  | Trophy icon             | View high scores               |
| `Achievements.png` | Star/medal icon         | View achievements              |

**Usage**: Used in the title screen, pause menu, level select, and game-over screens.
**Game logic**: Render as clickable sprites. Scale up 2-3x for visibility (they're small pixel art). Add hover/press effects in code (slight scale or tint change).

### Level Thumbnails

**Location**: `pack/Menu/Levels/`

50 numbered thumbnails (`01.png` through `50.png`), each approximately 18x18 pixels. Each shows its level number in the pack's pixel font style.

**Usage**: Level selection grid. Each thumbnail represents a playable level.
**Game logic**: Display in a scrollable grid. Locked levels can be dimmed/grayed out. The number on the thumbnail matches the level order.

### Bitmap Text

**Location**: `pack/Menu/Text/`

| File                      | Size  | Description                                                     |
| ------------------------- | ----- | --------------------------------------------------------------- |
| `Text (White) (8x10).png` | 80x50 | White pixel font atlas — 10 columns x 5 rows of 8x10 characters |
| `Text (Black) (8x10).png` | 80x50 | Black pixel font atlas — same layout                            |

**Character layout** (8x10 per glyph, 10 columns x 5 rows):

```
Row 0: A B C D E F G H I J
Row 1: K L M N O P Q R S T
Row 2: U V W X Y Z 0 1 2 3
Row 3: 4 5 6 7 8 9 : . ! ?
Row 4: (space and possibly more symbols)
```

**Usage**: All in-game text rendering — score display, level names, menu labels, game over text.
**Game logic**: To use with Pixi.js `BitmapText`, you need to generate a `.fnt` (BMFont) descriptor file that maps character codes to atlas regions. Each glyph is 8px wide, 10px tall. Alternatively, build a custom text renderer that slices the atlas manually.

**CMS alternative**: The CMS `bitmapFont` component manages proper BMFont files (atlas + descriptor). For the thesis demo, you could:

1. Use the pack's pixel font for the default look
2. Upload a different SDF bitmap font via the CMS to demonstrate hot-swapping

---

## 9. Effects & Particles

**Location**: `pack/Other/`

| File                   | Size  | Frames     | Description                                                        | Usage                                                                                                                         |
| ---------------------- | ----- | ---------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `Dust Particle.png`    | 16x16 | 1 (static) | Small white dust speck                                             | Emit when hero lands, runs, or wall-jumps. Spawn several at the hero's feet with random velocity.                             |
| `Shadow.png`           | 16x16 | 1 (static) | Soft circular shadow                                               | Render below the hero and below floating items. Scale based on distance from ground.                                          |
| `Confetti (16x16).png` | 96x16 | 6 (colors) | 6 colored confetti pieces (green, yellow, red, pink, orange, blue) | Spawn on level completion, fruit collection milestone, or achievement. Each piece is 16x16 — pick random colors.              |
| `Transition.png`       | 44x44 | 1 (static) | Dark diamond shape                                                 | Used for screen transitions between rooms. Scale up to fill screen, then scale down to reveal new room (diamond wipe effect). |

### Particle Emission Guide

**Dust particles** — spawn on these events:

- Hero lands on ground: 3-5 particles at feet, spread horizontally
- Hero runs: 1 particle every few frames behind the hero
- Hero wall-jumps: 2-3 particles at the wall contact point
- Box breaks: 5-8 particles at box position

**Confetti** — spawn on these events:

- Room complete (reach end trophy): burst of 20-30 confetti pieces
- All fruits collected in a room: burst of 15 confetti pieces

**Shadow** — always rendered:

- Below the hero (opacity decreases with height above ground)
- Below floating fruits (subtle, low opacity)

---

## 10. CMS Upload Plan

Step-by-step guide for populating the CMS with all game assets.

### Step 1: Create Hero Entities (4 + 1)

For each pixel-art character (Ninja Frog, Mask Dude, Pink Man, Virtual Guy):

1. Create a `hero` entity
2. Set `name` to the character name
3. Set `animation` alternative to **spritesheet**
4. Upload all 7 animation PNGs into the `sprites` asset wrapper:
   - `Idle (32x32).png`
   - `Run (32x32).png`
   - `Jump (32x32).png`
   - `Fall (32x32).png`
   - `Double Jump (32x32).png`
   - `Hit (32x32).png`
   - `Wall Jump (32x32).png`
5. Set `frameWidth` = 32, `frameHeight` = 32
6. Set stats: hp=100, speed=3, jumpForce=8
7. Publish

For Spineboy:

1. Create a `hero` entity
2. Set `name` to "Spineboy"
3. Set `animation` alternative to **spine**
4. Upload the Spine skeleton JSON, atlas, and texture (already bundled with CMS)
5. Publish

### Step 2: Create Trap Entities (8-13)

For each trap type used:

1. Create a `trap` entity
2. Upload the trap's PNG files into `sprites`
3. Set `frameWidth`, `frameHeight` from the asset data above
4. Set `damage`, `behavior`, `moveRange`, `moveSpeed` from the suggested values above
5. Publish

**Recommended starter set** (8 traps for a good demo):

- Spikes (static, simple)
- Saw (moving, visually impressive)
- Fire (triggered, timed cycle)
- Rock Head (triggered, proximity-based)
- Falling Platform (triggered, terrain-based)
- Trampoline (helper, not a hazard)
- Moving Platform (helper, patrol)
- Arrow (projectile, adds ranged danger)

### Step 3: Create Item Entities (9 fruits + 3 boxes = 12)

For each fruit:

1. Create an `item` entity
2. Upload the fruit sprite strip PNG
3. Set `frameWidth` = 32, `frameHeight` = 32
4. Set `effect` = `score`, `value` = point amount (10/20/30)
5. Publish

For each box:

1. Create an `item` entity
2. Upload Idle, Hit, Break PNGs
3. Set `frameWidth` = 28, `frameHeight` = 24
4. Set `effect` = `destroy`, `value` = hits to break (1-3)
5. Publish

### Step 4: Create Room Entities (3-5 for demo)

For each room:

1. Create a `room` entity
2. Set `name` (e.g., "Forest Start")
3. Set `background` dropdown (e.g., "Green")
4. Upload `Terrain (16x16).png` into `terrain`
5. Write `layout` JSON defining the tile grid
6. Add trap placements (references to trap entities + x/y positions)
7. Add item placements (references to item entities + x/y positions)
8. Publish

### Step 5: Create Level Entities (1-2 for demo)

1. Create a `level` entity
2. Set `name` (e.g., "Forest World")
3. Add room references in order to the `rooms` repeatable
4. Upload/select bitmap fonts for `uiFont` and `scoreFont`
5. Publish

### Step 6: Create Game Config (singleton)

1. Create the `game-config` entity
2. Set `title` = "Pixel Dash"
3. Upload/select title bitmap font
4. Set `heroRef` to the Ninja Frog hero entity
5. Set `startingLevel` to the first level entity
6. Set `gravity` = 12, `jumpForce` = 8, `defaultLives` = 3
7. Upload shared effects (Appearing, Disappearing, Collected, Dust Particle, etc.)
8. Publish

### Asset Count Summary

| Category       | Entities                    | PNGs Uploaded                          |
| -------------- | --------------------------- | -------------------------------------- |
| Heroes         | 5 (4 spritesheet + 1 Spine) | 28 character PNGs + Spine files        |
| Traps          | 8-13                        | 20-35 trap PNGs                        |
| Items (fruits) | 9                           | 9 fruit PNGs + 1 Collected effect      |
| Items (boxes)  | 3                           | 9 box PNGs                             |
| Rooms          | 3-5                         | 1 terrain tileset per room (can share) |
| Levels         | 1-2                         | Bitmap font files                      |
| Game Config    | 1                           | Shared effects + fonts                 |
| **Total**      | **~30-38**                  | **~70-85 PNGs**                        |
