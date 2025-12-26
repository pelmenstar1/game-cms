import { type ComponentProps, type Key, type ReactNode } from 'react';

import { classNames } from '../../utils/classNames';
import { UnstyledOption } from '../UnstyledOption';
import styles from './OptionSwitch.module.scss';

export interface OptionSwitchProps<T extends Key> extends Omit<
  ComponentProps<'div'>,
  'children'
> {
  itemClassName?: string;
  options: T[];
  selected?: T;
  renderOption?: (option: T) => ReactNode;
  onOptionSelected?: (value: T) => void;

  disabled?: boolean;
}

export function OptionSwitch<T extends Key>({
  className,
  itemClassName,
  options,
  style,
  selected,
  disabled,
  onOptionSelected,
  renderOption,
  ...rest
}: OptionSwitchProps<T>) {
  const selectedIndex = selected !== undefined ? options.indexOf(selected) : -1;

  return (
    <div
      className={classNames(styles.root, className)}
      style={{
        ['--children-count']: options.length,
        ['--selected-index']: selectedIndex,
        ...style,
      }}
      {...rest}
    >
      {options.map((option, index) => (
        <UnstyledOption
          key={option}
          className={classNames(
            styles['item'],
            disabled && styles['item-disabled'],
            itemClassName
          )}
          inputClassName={styles['item-input']}
          type="radio"
          checked={selectedIndex === index}
          disabled={disabled}
          onChange={() => {
            onOptionSelected?.(options[index]);
          }}
        >
          {renderOption?.(option) ?? option}
        </UnstyledOption>
      ))}
    </div>
  );
}
