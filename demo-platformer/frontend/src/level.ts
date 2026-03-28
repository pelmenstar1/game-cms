import type { LevelDef, RoomDef } from './types';

export class Level {
  readonly name: string;
  readonly rooms: RoomDef[];

  private currentIndex = 0;

  constructor(def: LevelDef) {
    this.name = def.name;
    this.rooms = def.rooms;
  }

  getCurrentRoom(): RoomDef {
    return this.rooms[this.currentIndex];
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /** Advance to the next room. Returns the new room def, or null if level is complete. */
  advance(): RoomDef | null {
    this.currentIndex++;
    if (this.currentIndex >= this.rooms.length) {
      return null;
    }
    return this.rooms[this.currentIndex];
  }

  reset(): void {
    this.currentIndex = 0;
  }

  isComplete(): boolean {
    return this.currentIndex >= this.rooms.length;
  }
}
