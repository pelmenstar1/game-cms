import {
  AnimatedSprite,
  Assets,
  Container,
  Text,
  TextStyle,
  Texture,
  TilingSprite,
} from 'pixi.js';

import { ANIMATION_SPEED, KEYS } from '../constants';
import { justPressed } from '../input';
import type { Scene } from '../types';

export class TitleScene implements Scene {
  private onStart: () => void;

  readonly container = new Container();

  constructor(
    private screenWidth: number,
    private screenHeight: number,
    private title: string,
    private backgroundAlias: string,
    private heroIdleFrames: Texture[],
    onStart: () => void
  ) {
    this.onStart = onStart;
  }

  enter(): void {
    // Tiling background
    const bgTexture = Assets.get<Texture>(this.backgroundAlias);
    const bg = new TilingSprite({
      texture: bgTexture,
      width: this.screenWidth,
      height: this.screenHeight,
    });
    this.container.addChild(bg);

    // Title text (from CMS config)
    const titleStyle = new TextStyle({
      fontFamily: 'monospace',
      fontSize: 48,
      fill: 0xffffff,
      stroke: { color: 0x000000, width: 5 },
      fontWeight: 'bold',
    });
    const titleText = new Text({ text: this.title, style: titleStyle });
    titleText.anchor.set(0.5);
    titleText.x = this.screenWidth / 2;
    titleText.y = this.screenHeight / 3;
    this.container.addChild(titleText);

    // Idle hero animation (from CMS hero data)
    if (this.heroIdleFrames.length > 0) {
      const heroSprite = new AnimatedSprite(this.heroIdleFrames);
      heroSprite.animationSpeed = ANIMATION_SPEED;
      heroSprite.anchor.set(0.5);
      heroSprite.scale.set(4);
      heroSprite.x = this.screenWidth / 2;
      heroSprite.y = this.screenHeight / 2 + 20;
      heroSprite.play();
      this.container.addChild(heroSprite);
    }

    // Prompt text
    const promptStyle = new TextStyle({
      fontFamily: 'monospace',
      fontSize: 18,
      stroke: { color: 0x000000, width: 5 },
      fill: 0xcccccc,
    });
    const prompt = new Text({
      text: 'Press ENTER to start',
      style: promptStyle,
    });
    prompt.anchor.set(0.5);
    prompt.x = this.screenWidth / 2;
    prompt.y = this.screenHeight * 0.75;
    this.container.addChild(prompt);
  }

  update(_dt: number): void {
    if (justPressed(KEYS.ENTER)) {
      this.onStart();
    }
  }

  exit(): void {
    this.container.removeChildren();
  }
}
