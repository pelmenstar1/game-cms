import type { Application } from 'pixi.js';

import type { Scene } from '../types';

export class SceneManager {
  private current: Scene | null = null;

  constructor(private app: Application) {}

  setScene(scene: Scene): void {
    if (this.current) {
      this.current.exit();
      this.app.stage.removeChild(this.current.container);
    }

    this.current = scene;
    this.app.stage.addChild(scene.container);
    scene.enter();
  }

  update(dt: number): void {
    this.current?.update(dt);
  }
}
