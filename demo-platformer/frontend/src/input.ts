const held = new Set<string>();
const justPressedSet = new Set<string>();
const justPressedBuffer = new Set<string>();

export function initInput(): void {
  window.addEventListener('keydown', (e) => {
    if (!held.has(e.code)) {
      justPressedBuffer.add(e.code);
    }
    held.add(e.code);
  });

  window.addEventListener('keyup', (e) => {
    held.delete(e.code);
  });
}

/** Is the key currently held down? */
export function isDown(key: string): boolean {
  return held.has(key);
}

/** Was the key pressed this frame (first frame only)? */
export function justPressed(key: string): boolean {
  return justPressedSet.has(key);
}

/** Call once per frame at the start of the update loop. */
export function updateInput(): void {
  justPressedSet.clear();
  for (const key of justPressedBuffer) {
    justPressedSet.add(key);
  }
  justPressedBuffer.clear();
}
