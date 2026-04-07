import { resizeArray } from '@game-cms/shared/collections';
import { classNames } from '@game-cms/ui';

import { SelectableTile } from './components/SelectableTile';
import styles from './TileGridEditor.module.scss';

export interface TileGridEditorProps {
  className?: string;
  grid: number[];
  width: number;
  height: number;
  onGridChanged?: (grid: number[]) => void;
  readOnly?: boolean;
}

export function TileGridEditor({
  className,
  grid,
  width,
  height,
  onGridChanged,
}: TileGridEditorProps) {
  const tileCount = width * height;

  return (
    <div
      className={classNames(styles.root, className)}
      style={{
        '--width': width,
        '--height': height,
      }}
    >
      {Array.from({ length: tileCount }, (_, index) => {
        return (
          <SelectableTile
            key={index}
            selected={grid[index] === 1}
            onSelectedChanged={(state) => {
              const result = resizeArray(grid, tileCount, 0);
              result[index] = state ? 1 : 0;

              onGridChanged?.(result);
            }}
          />
        );
      })}
    </div>
  );
}
