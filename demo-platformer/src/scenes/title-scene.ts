import {
  Assets,
  Container,
  Text,
  TextStyle,
  Texture,
  TilingSprite,
} from 'pixi.js';
import { AnimatedSprite } from 'pixi.js';

import { sliceSpriteStrip } from '../assets';
import { ANIMATION_SPEED, KEYS } from '../constants';
import { justPressed } from '../input';
import type { Scene } from '../types';

export class TitleScene implements Scene {
  readonly container = new Container();

  private onStart: () => void;

  constructor(
    private screenWidth: number,
    private screenHeight: number,
    onStart: () => void
  ) {
    this.onStart = onStart;
  }

  enter(): void {
    // Tiling background
    const bgTexture = Assets.get<Texture>('pack/Background/Blue.png');
    const bg = new TilingSprite({
      texture: bgTexture,
      width: this.screenWidth,
      height: this.screenHeight,
    });
    this.container.addChild(bg);

    // Title text
    const titleStyle = new TextStyle({
      fontFamily: 'monospace',
      fontSize: 48,
      fill: 0xffffff,
      stroke: { color: 0x000000, width: 5 },
      fontWeight: 'bold',
    });
    const title = new Text({ text: 'Pixel Dash', style: titleStyle });
    title.anchor.set(0.5);
    title.x = this.screenWidth / 2;
    title.y = this.screenHeight / 3;
    this.container.addChild(title);

    // Idle hero animation
    const idleTexture = Assets.get<Texture>(
      'pack/Main Characters/Ninja Frog/Idle (32x32).png'
    );
    const idleFrames = sliceSpriteStrip(idleTexture, 32, 32);
    const heroSprite = new AnimatedSprite(idleFrames);
    heroSprite.animationSpeed = ANIMATION_SPEED;
    heroSprite.anchor.set(0.5);
    heroSprite.scale.set(4);
    heroSprite.x = this.screenWidth / 2;
    heroSprite.y = this.screenHeight / 2 + 20;
    heroSprite.play();
    this.container.addChild(heroSprite);

    // Prompt text
    const promptStyle = new TextStyle({
      fontFamily: 'monospace',
      fontSize: 18,
      fill: 0xcccccc,
    });
    const prompt = new Text({
      text: 'Press ENTER to play',
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
