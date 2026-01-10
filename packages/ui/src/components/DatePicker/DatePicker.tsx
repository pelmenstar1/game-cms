import { resolveDateLike } from '@game-cms/shared/chrono';
import { formatTwoDigit } from '@game-cms/shared/string';
import type { ChangeEvent } from 'react';

import { classNames } from '../../utils/classNames';
import { Typography } from '../Typography';
import styles from './DatePicker.module.scss';

export interface DatePickerProps {
  className?: string;
  min?: string | Date;
  max?: string | Date;
  value: Date;
  onValueChanged?: (value: Date) => void;
}

function formatDateLocal(value: string | Date) {
  value = resolveDateLike(value);

  return `${value.getFullYear()}-${formatTwoDigit(value.getMonth() + 1)}-${formatTwoDigit(value.getDate())}`;
}

export function DatePicker({
  className,
  min,
  max,
  value,
  onValueChanged,
}: DatePickerProps) {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChanged?.(new Date(event.target.value));
  };

  return (
    <Typography
      as="input"
      type="date"
      variant="caption"
      className={classNames(styles.root, className)}
      min={min ? formatDateLocal(min) : undefined}
      max={max ? formatDateLocal(max) : undefined}
      value={formatDateLocal(value)}
      onChange={onChange}
    />
  );
}
