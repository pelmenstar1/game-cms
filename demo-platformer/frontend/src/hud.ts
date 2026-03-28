import { Container, Text, TextStyle } from 'pixi.js';

import type { GameState } from './types';

const STYLE = new TextStyle({
  fontFamily: 'monospace',
  fontSize: 16,
  fill: 0xffffff,
  stroke: { color: 0x000000, width: 3 },
});

export class HUD {
  readonly container = new Container();

  private scoreText: Text;
  private hpText: Text;
  private livesText: Text;

  constructor() {
    this.scoreText = new Text({ text: 'Score: 0', style: STYLE });
    this.scoreText.x = 10;
    this.scoreText.y = 10;

    this.hpText = new Text({ text: 'HP: 3', style: STYLE });
    this.hpText.x = 10;
    this.hpText.y = 32;

    this.livesText = new Text({ text: 'Lives: 3', style: STYLE });
    this.livesText.x = 10;
    this.livesText.y = 54;

    this.container.addChild(this.scoreText, this.hpText, this.livesText);
  }

  update(state: GameState): void {
    this.scoreText.text = `Score: ${state.score}`;
    this.hpText.text = `HP: ${state.hp}/${state.maxHp}`;
    this.livesText.text = `Lives: ${state.lives}`;
  }
}
