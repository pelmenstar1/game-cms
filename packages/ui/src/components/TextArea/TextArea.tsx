import { ChangeEvent, ComponentProps, useMemo } from 'react';

import { Typography } from '../Typography';
import styles from './TextArea.module.scss';
import { classNames } from '../../utils/classNames';

export interface TextAreaProps extends ComponentProps<'textarea'> {
  variant?: 'primary' | 'inverted-primary';
  autoSize?: boolean;
  onTextChanged?: (value: string) => void;
}

export function TextArea({
  variant = 'primary',
  autoSize,
  value,
  className,
  onChange,
  onTextChanged,
  ...rest
}: TextAreaProps) {
  const newOnChange = useMemo(
    () =>
      onChange ??
      ((event: ChangeEvent<HTMLInputElement>) => {
        onTextChanged?.(event.target.value);
      }),
    [onChange, onTextChanged]
  );

  const textArea = (
    <Typography
      as="textarea"
      className={classNames(styles.root, styles[`root-${variant}`], className)}
      value={value}
      onChange={newOnChange}
      {...rest}
    />
  );

  if (autoSize) {
    return (
      <Typography
        as="div"
        className={classNames(styles.autosizer)}
        data-value={value}
      >
        {textArea}
      </Typography>
    );
  }

  return textArea;
}
