import { SvgProps } from '../types';

export function DragHandleIcon(props: SvgProps) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <circle cx="10" cy="8" r="1" />
      <circle cx="14" cy="8" r="1" />
      <circle cx="10" cy="16" r="1" />
      <circle cx="14" cy="16" r="1" />
      <circle cx="10" cy="12" r="1" />
      <circle cx="14" cy="12" r="1" />
    </svg>
  );
}
