import { ComponentDefaultRenderer } from '@game-cms/core';
import { Labeled, TextInput } from '@game-cms/ui';

import { TileGridEditor } from '../../micro/TileGridEditor';
import styles from './renderer.module.scss';
import { Id } from './types';

const parseInteger = (value: string) => {
  const parsed = Number.parseInt(value, 10);

  if (parsed > 0) {
    return parsed;
  }
};

export const renderer: ComponentDefaultRenderer<Id> = ({
  data,
  error,
  readOnly,
  onDataChanged,
}) => {
  const onWidthChanged = (width: string) => {
    onDataChanged?.({ ...data, width });
  };

  const onHeightChanged = (height: string) => {
    onDataChanged?.({ ...data, height });
  };

  const onGridChanged = (grid: number[]) => {
    onDataChanged?.({ ...data, grid });
  };

  const width = parseInteger(data.width);
  const height = parseInteger(data.height);

  return (
    <div className={styles.root}>
      <div className={styles['info-row']}>
        <Labeled title="Width">
          <TextInput
            value={data.width}
            readOnly={readOnly}
            error={error === 'INVALID_WIDTH' ? 'Invalid width' : undefined}
            className={styles['input']}
            onTextChanged={onWidthChanged}
          />
        </Labeled>

        <Labeled title="Height">
          <TextInput
            value={data.height}
            readOnly={readOnly}
            error={error === 'INVALID_HEIGHT' ? 'Invalid height' : undefined}
            className={styles['input']}
            onTextChanged={onHeightChanged}
          />
        </Labeled>
      </div>

      {width && height && (
        <TileGridEditor
          grid={data.grid}
          width={width}
          height={height}
          onGridChanged={onGridChanged}
        />
      )}
    </div>
  );
};
