import { Size } from '@game-cms/shared';
import {
  Application,
  BitmapFont,
  BitmapText,
  Graphics,
  StrokeInput,
} from 'pixi.js';

export type BitmapFontPreviewApp = Awaited<
  ReturnType<typeof createBitmapFontPreviewApp>
>;

const COLUMN_COUNT = 6;
const GUIDES_COLOR = 0x44_44_44;

export async function createBitmapFontPreviewApp() {
  const app = new Application();
  const gridGuides = new Graphics();

  await app.init({
    autoDensity: true,
    backgroundAlpha: 0,
    antialias: true,
  });

  function getCharCount() {
    // Exclude grid guides from the count
    return app.stage.children.length - 1;
  }

  function getRowHeight(rowIndex: number) {
    const { stage } = app;
    const startIndex = rowIndex * COLUMN_COUNT;

    let maxHeight = 0;
    for (let i = startIndex; i < startIndex + COLUMN_COUNT; i++) {
      const child = stage.children[i];

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (child) {
        maxHeight = Math.max(maxHeight, child.height);
      }
    }

    return maxHeight;
  }

  function updateComponentPositions() {
    const { stage, screen } = app;

    const columnWidth = screen.width / COLUMN_COUNT;
    let y = 0;

    let row = 0;
    let column = 0;

    for (let i = 0; i < getCharCount(); i++) {
      const child = stage.children[i];

      child.x = column * columnWidth;
      child.y = y;

      column++;
      if (column >= COLUMN_COUNT) {
        column = 0;
        y += getRowHeight(row);
        row++;
      }
    }
  }

  function updateGridGuides() {
    const { screen } = app;

    const columnWidth = screen.width / COLUMN_COUNT;
    const rowCount = Math.ceil(getCharCount() / COLUMN_COUNT);

    const strokeOptions: StrokeInput = {
      width: 1,
      color: GUIDES_COLOR,
      pixelLine: true,
    };

    gridGuides.clear();

    for (let column = 1; column < COLUMN_COUNT; column++) {
      const x = column * columnWidth;

      gridGuides.moveTo(x, 0).lineTo(x, screen.height).stroke(strokeOptions);
    }

    let accumulatedRowY = getRowHeight(0);

    for (let row = 1; row < rowCount; row++) {
      const rowHeight = getRowHeight(row);

      gridGuides
        .moveTo(0, accumulatedRowY)
        .lineTo(screen.width, accumulatedRowY)
        .stroke(strokeOptions);

      accumulatedRowY += rowHeight;
    }
  }

  function invalidate() {
    updateComponentPositions();
    updateGridGuides();
  }

  function setSize(size: Size) {
    app.renderer.resize(size.width, size.height);

    invalidate();
  }

  function setFont(font: BitmapFont) {
    const { stage } = app;

    stage.removeChildren();

    for (const [char] of Object.entries(font.chars)) {
      const charComponent = new BitmapText({
        text: char,
        style: {
          fontFamily: font.fontFamily,
          fill: 0xff_ff_ff,
          fontSize: 30,
        },
      });

      stage.addChild(charComponent);
    }

    app.stage.addChild(gridGuides);

    invalidate();
  }

  return {
    pixiApp: app,
    setFont,
    setSize,
  };
}
