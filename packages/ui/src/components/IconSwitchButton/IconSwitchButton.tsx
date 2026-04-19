import type { ChangeEvent, ComponentProps, ReactElement } from 'react';

import { classNames } from '../../utils/classNames';
import {
  IconComponentBase,
  type IconComponentBaseProps,
} from '../IconComponentBase';
import styles from './IconSwitchButton.module.scss';

export interface IconSwitchButtonProps
  extends Omit<ComponentProps<'input'>, 'type'>, IconComponentBaseProps {
  onCheckedChanged?: (state: boolean) => void;
  children: ReactElement;
}

export function IconSwitchButton({
  className,
  children,
  checked,
  title,
  rounding,
  hover,
  onCheckedChanged,
  ...rest
}: IconSwitchButtonProps) {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    onCheckedChanged?.(event.target.checked);
  };

  return (
    <IconComponentBase
      as="label"
      title={title}
      rounding={rounding}
      hover={hover}
      className={classNames(checked && styles['root-checked'], className)}
    >
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={onChange}
        {...rest}
      />
      {children}
    </IconComponentBase>
  );
}
