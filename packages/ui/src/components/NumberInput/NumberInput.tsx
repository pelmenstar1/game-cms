import { clampNumber } from '@game-cms/shared';
import { type PointerEvent, useRef } from 'react';

import { UpDownIcon } from '../../icons/UpDownIcon';
import { classNames } from '../../utils/classNames';
import { IconButton } from '../IconButton';
import { TextInput } from '../TextInput';
import styles from './NumberInput.module.scss';

export interface NumberInputProps {
  className?: string;
  text: string;
  min?: number;
  max?: number;
  integer?: boolean;
  error?: string;
  readOnly?: boolean;
  onTextChanged?: (text: string) => void;
}

type DragState = {
  pointerId: number;
  startX: number;
  startValue: number;
  sensitivity: number;
  isDragging: boolean;
};

export function NumberInput({
  className,
  text,
  min,
  max,
  integer,
  error,
  readOnly,
  onTextChanged,
}: NumberInputProps) {
  const current = Number.parseFloat(text);
  const atMin = min !== undefined && !Number.isNaN(current) && current <= min;
  const atMax = max !== undefined && !Number.isNaN(current) && current >= max;

  const dragRef = useRef<DragState | null>(null);

  function constrain(value: number) {
    const rounded = integer ? Math.round(value) : value;
    const result = clampNumber(min ?? rounded, max ?? rounded, rounded);

    return result.toString();
  }

  function step(delta: number) {
    const next = Number.isNaN(current) ? delta : current + delta;

    onTextChanged?.(constrain(next));
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    const range =
      min !== undefined && max !== undefined ? max - min : undefined;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startValue: Number.isNaN(current) ? 0 : current,
      sensitivity: range !== undefined ? range / 100 : 1,
      isDragging: false,
    };
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }

    const delta = event.clientX - drag.startX;

    if (!drag.isDragging && Math.abs(delta) >= 3) {
      drag.isDragging = true;

      event.currentTarget.setPointerCapture(drag.pointerId);
    }

    const next = drag.startValue + delta * drag.sensitivity;

    onTextChanged?.(constrain(next));
  }

  function endDrag() {
    dragRef.current = null;
  }

  return (
    <TextInput
      className={classNames(styles['root'], className)}
      value={text}
      error={error}
      readOnly={readOnly}
      onTextChanged={onTextChanged}
      endContent={
        <div
          className={styles['buttons']}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <IconButton
            title="Increase"
            className={styles['step-button']}
            disabled={atMax}
            onClick={() => {
              step(1);
            }}
          >
            <UpDownIcon isUp />
          </IconButton>

          <IconButton
            title="Decrease"
            className={styles['step-button']}
            disabled={atMin}
            onClick={() => {
              step(-1);
            }}
          >
            <UpDownIcon />
          </IconButton>
        </div>
      }
    />
  );
}
