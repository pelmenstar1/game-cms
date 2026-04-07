import { useState } from 'react';

import preview from '#storybook/preview';

import { TileGridEditor, TileGridEditorProps } from './TileGridEditor';

function StatefulTileGridEditor(
  props: Omit<TileGridEditorProps, 'grid' | 'onGridChanged'>
) {
  const { width, height, ...rest } = props;
  const [grid, setGrid] = useState(() =>
    Array.from({ length: width * height }, () => 0)
  );

  return (
    <TileGridEditor
      {...rest}
      grid={grid}
      width={width}
      height={height}
      onGridChanged={setGrid}
    />
  );
}

const meta = preview.meta({ component: StatefulTileGridEditor });

export const Primary: unknown = meta.story({
  args: {
    width: 8,
    height: 8,
  },
});
