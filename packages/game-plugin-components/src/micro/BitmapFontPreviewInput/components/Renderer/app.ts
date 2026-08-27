import { Size } from '@game-cms/shared';
import { Application, BitmapFont, BitmapText } from 'pixi.js';

export type BitmapFontInputApp = Awaited<
  ReturnType<typeof createBitmapFontInputApp>
>;

export async function createBitmapFontInputApp() {
  const app = new Application();
  let text: string = '';

  await app.init({
    autoDensity: true,
    backgroundAlpha: 0,
    antialias: true,
  });

  function setSize(size: Size) {
    app.renderer.resize(size.width, size.height);
  }

  function setFont(font: BitmapFont) {
    const { stage } = app;

    const bitmapText = new BitmapText({
      text,
      style: {
        fontFamily: font.fontFamily,
      },
    });

    stage.removeChildren();
    stage.addChild(bitmapText);
  }

  function setText(value: string) {
    text = value;

    const bitmapText = app.stage.children[0] as BitmapText | undefined;

    if (bitmapText) {
      bitmapText.text = text;
    }
  }

  return {
    pixiApp: app,
    setSize,
    setFont,
    setText,
  };
}
