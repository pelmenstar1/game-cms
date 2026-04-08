import { resizeArray } from '@game-cms/shared/collections';
import { classNames, SelectionGrid } from '@game-cms/ui';
import { useRef } from 'react';

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
  readOnly,
}: TileGridEditorProps) {
  const tileCount = width * height;

  const dragMode = useRef<boolean | null>(null);
  const gridSnapshot = useRef<number[]>([]);
  const hasDragged = useRef(false);
  const clickedTileIndex = useRef<number | null>(null);

  return (
    <div
      className={className}
      onPointerDown={(event) => {
        dragMode.current = null;
        hasDragged.current = false;
        // event.target still has the original tile before setPointerCapture redirects events
        const target = event.target as HTMLElement;
        const indexStr = target.dataset['index'];
        clickedTileIndex.current =
          indexStr !== undefined ? Number(indexStr) : null;
      }}
      onPointerUp={() => {
        if (
          !hasDragged.current &&
          clickedTileIndex.current !== null &&
          !readOnly
        ) {
          const index = clickedTileIndex.current;
          const result = resizeArray(grid, tileCount, 0);
          result[index] = result[index] === 1 ? 0 : 1;
          onGridChanged?.(result);
        }
      }}
    >
      <SelectionGrid
        className={classNames(styles.root)}
        style={{
          '--grid-columns': width,
          '--grid-rows': height,
        }}
        disabled={readOnly}
        onSelectionChanged={(indices) => {
          if (indices.length === 0) {
            return;
          }

          hasDragged.current = true;

          if (dragMode.current === null) {
            gridSnapshot.current = resizeArray(grid, tileCount, 0);
            dragMode.current = gridSnapshot.current[indices[0]] !== 1;
          }

          const result = [...gridSnapshot.current];
          const newValue = dragMode.current ? 1 : 0;
          for (const idx of indices) {
            result[idx] = newValue;
          }

          onGridChanged?.(result);
        }}
      >
        {Array.from({ length: tileCount }, (_, index) => (
          <SelectableTile
            key={index}
            data-index={index}
            selected={grid[index] === 1}
          />
        ))}
      </SelectionGrid>
    </div>
  );
}
