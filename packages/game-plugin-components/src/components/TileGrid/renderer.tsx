import { ComponentDefaultRenderer } from '@game-cms/core';

import { TileGridEditor } from '../../micro/TileGridEditor';
import { Id } from './types';

export const renderer: ComponentDefaultRenderer<Id> = ({
  data,
  options,
  onDataChanged,
  readOnly,
}) => {
  const { width, height } = options;

  return (
    <TileGridEditor
      grid={data}
      width={width}
      height={height}
      onGridChanged={onDataChanged}
      readOnly={readOnly}
    />
  );
};
