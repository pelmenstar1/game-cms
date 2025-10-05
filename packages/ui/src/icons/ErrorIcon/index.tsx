import { SvgProps } from '../types';

export function ErrorIcon(props: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} stroke="#ff0000">
      <path
        d="M12 8V12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 16.0195V16"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
