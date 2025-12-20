import { DragHandleIcon } from '../../icons/DragHandleIcon';
import { type BaseIconButtonProps, IconButton } from '../IconButton';

export type DragHandleProps = Omit<BaseIconButtonProps, 'title' | 'children'>;

export function DragHandle(props: DragHandleProps) {
  return (
    <IconButton aria-hidden {...props}>
      <DragHandleIcon />
    </IconButton>
  );
}
