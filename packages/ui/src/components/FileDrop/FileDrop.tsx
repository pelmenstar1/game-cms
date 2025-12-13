import { cloneElement, DOMAttributes, ReactElement, useState } from 'react';

type Events = Pick<
  DOMAttributes<HTMLElement>,
  'onDragEnter' | 'onDragLeave' | 'onDragOver' | 'onDrop'
>;

export interface FileDropProps {
  disabled?: boolean;
  onFiles?: (files: FileList) => void;
  children: ReactElement<
    Events & {
      'data-over'?: unknown;
    }
  >;
}

export function FileDrop({ disabled, onFiles, children }: FileDropProps) {
  const [isOver, setOver] = useState(false);

  function changeIsOver(value: boolean) {
    if (!disabled) {
      setOver(value);
    }
  }

  return cloneElement(children, {
    'data-over': isOver,
    onDragEnter: () => {
      changeIsOver(true);
    },
    onDragLeave: () => {
      changeIsOver(false);
    },
    onDragOver: (e) => {
      e.preventDefault();

      changeIsOver(true);
    },
    onDrop: (e) => {
      if (!disabled) {
        e.preventDefault();

        onFiles?.(e.dataTransfer.files);
        setOver(false);
      }
    },
  });
}
