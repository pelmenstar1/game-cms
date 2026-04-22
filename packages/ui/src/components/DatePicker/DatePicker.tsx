import { type DateLike, resolveDateLike } from '@game-cms/shared/chrono';
import { formatTwoDigit } from '@game-cms/shared/string';
import type { ChangeEvent } from 'react';

import { classNames } from '../../utils/classNames';
import { Typography } from '../Typography';
import styles from './DatePicker.module.scss';

export interface DatePickerProps {
  className?: string;
  min?: DateLike;
  max?: DateLike;
  value: DateLike;
  onValueChanged?: (value: Date) => void;
}

function formatDateLocal(value: DateLike | undefined) {
  if (value === undefined) {
    return;
  }

  value = resolveDateLike(value);

  const year = value.getFullYear();
  const month = formatTwoDigit(value.getMonth() + 1);
  const day = formatTwoDigit(value.getDate());

  return `${year}-${month}-${day}`;
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
      min={formatDateLocal(min)}
      max={formatDateLocal(max)}
      value={formatDateLocal(value)}
      onChange={onChange}
    />
  );
}
