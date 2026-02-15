import { Size } from '@game-cms/shared';
import {
  Application,
  BitmapFont,
  BitmapText,
  Graphics,
  StrokeInput,
} from 'pixi.js';

export type BitmapFontGridApp = Awaited<
  ReturnType<typeof createBitmapFontGridApp>
>;

const COLUMN_COUNT = 6;
const GUIDES_COLOR = 0x44_44_44;

export async function createBitmapFontGridApp() {
  const app = new Application();
  const gridGuides = new Graphics();

  let charSizes: Size[] = [];
  let rowHeights: number[] = [];

  await app.init({
    autoDensity: true,
    backgroundAlpha: 0,
    antialias: true,
  });

  function getCharCount() {
    // Exclude grid guides from the count
    return app.stage.children.length - 1;
  }

  function updateRowHeights() {
    rowHeights = [];

    let maxHeight = 0;
    let columnIndex = 0;

    for (let i = 0; i < getCharCount(); i++) {
      const charSize = charSizes[i];

      maxHeight = Math.max(maxHeight, charSize.height);

      if (columnIndex == COLUMN_COUNT - 1) {
        rowHeights.push(maxHeight * 1.5);

        columnIndex = 0;
        maxHeight = 0;
      } else {
        columnIndex++;
      }
    }
  }

  function updateComponentPositions() {
    const { stage, screen } = app;

    const columnWidth = screen.width / COLUMN_COUNT;

    let y = 0;
    let row = 0;
    let column = 0;

    for (let i = 0; i < getCharCount(); i++) {
      const child = stage.children[i];
      const baseX = column * columnWidth;

      const { width: charWidth } = charSizes[i];
      const rowHeight = rowHeights[row];

      child.x = baseX + columnWidth * 0.5;
      child.y = y + rowHeight * 0.5;
      child.scale = Math.min(charWidth, columnWidth) / charWidth;

      column++;
      if (column >= COLUMN_COUNT) {
        column = 0;
        y += rowHeight;
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

    let accumulatedRowY = rowHeights[0] ?? 0;

    for (let row = 1; row < rowCount; row++) {
      const rowHeight = rowHeights[row] ?? 0;

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

  function setFont(value: BitmapFont) {
    const { stage } = app;

    stage.removeChildren();

    charSizes = [];

    const fontSize = 30;
    const scale = fontSize / value.baseMeasurementFontSize;

    for (const [char, data] of Object.entries(value.chars)) {
      const { texture } = data;
      const charComponent = new BitmapText({
        text: char,
        style: {
          fontFamily: value.fontFamily,
          fill: 0xff_ff_ff,
          fontSize,
        },
      });

      charComponent.anchor.set(0.5);

      const width = texture?.width ?? 0;
      const height = texture?.height ?? 0;

      charSizes.push({
        width: (width + data.xOffset) * scale,
        height: (height + data.yOffset) * scale,
      });

      stage.addChild(charComponent);
    }

    stage.addChild(gridGuides);

    updateRowHeights();
    invalidate();
  }

  return {
    pixiApp: app,
    setFont,
    setSize,
  };
}
