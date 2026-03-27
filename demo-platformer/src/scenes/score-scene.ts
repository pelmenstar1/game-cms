import {
  Assets,
  Container,
  Text,
  TextStyle,
  Texture,
  TilingSprite,
} from 'pixi.js';

import { KEYS } from '../constants';
import { justPressed } from '../input';
import type { GameState, Scene } from '../types';

export class ScoreScene implements Scene {
  readonly container = new Container();

  constructor(
    private screenWidth: number,
    private screenHeight: number,
    private state: GameState,
    private onRestart: () => void
  ) {}

  enter(): void {
    // Background
    const bgTexture = Assets.get<Texture>('pack/Background/Purple.png');
    const bg = new TilingSprite({
      texture: bgTexture,
      width: this.screenWidth,
      height: this.screenHeight,
    });
    this.container.addChild(bg);

    const headerStyle = new TextStyle({
      fontFamily: 'monospace',
      fontSize: 40,
      fill: 0xffffff,
      stroke: { color: 0x000000, width: 4 },
      fontWeight: 'bold',
    });

    const won = this.state.lives > 0;
    const header = new Text({
      text: won ? 'Level Complete!' : 'Game Over',
      style: headerStyle,
    });
    header.anchor.set(0.5);
    header.x = this.screenWidth / 2;
    header.y = this.screenHeight / 4;
    this.container.addChild(header);

    const bodyStyle = new TextStyle({
      fontFamily: 'monospace',
      fontSize: 22,
      fill: 0xeeeeee,
    });

    const scoreText = new Text({
      text: `Score: ${this.state.score}`,
      style: bodyStyle,
    });
    scoreText.anchor.set(0.5);
    scoreText.x = this.screenWidth / 2;
    scoreText.y = this.screenHeight / 2 - 20;
    this.container.addChild(scoreText);

    const roomsText = new Text({
      text: `Rooms cleared: ${this.state.currentRoomIndex}`,
      style: bodyStyle,
    });
    roomsText.anchor.set(0.5);
    roomsText.x = this.screenWidth / 2;
    roomsText.y = this.screenHeight / 2 + 20;
    this.container.addChild(roomsText);

    const promptStyle = new TextStyle({
      fontFamily: 'monospace',
      fontSize: 18,
      fill: 0xaaaaaa,
    });
    const prompt = new Text({
      text: 'Press ENTER to restart',
      style: promptStyle,
    });
    prompt.anchor.set(0.5);
    prompt.x = this.screenWidth / 2;
    prompt.y = this.screenHeight * 0.75;
    this.container.addChild(prompt);
  }

  update(_dt: number): void {
    if (justPressed(KEYS.ENTER)) {
      this.onRestart();
    }
  }

  exit(): void {
    this.container.removeChildren();
  }
}
