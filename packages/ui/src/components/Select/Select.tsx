import { type ComponentProps, useCallback, useState } from 'react';

import { SelectBase, type SelectItem, type SelectItemKey } from '../SelectBase';
import { Typography } from '../Typography';

export interface SelectProps<
  T extends string = string,
> extends ComponentProps<'div'> {
  items: readonly SelectItem<T>[];
  selectedItem?: T;
  placeholder: string;
  disabled?: boolean;
  openDisabled?: boolean;

  onItemSelected?: (value: T) => void;
}

export function Select<T extends SelectItemKey>({
  items,
  placeholder,
  selectedItem,
  openDisabled,
  ...rest
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const switchOpen = useCallback(() => {
    if (!openDisabled) {
      setIsOpen((state) => !state);
    }
  }, [openDisabled]);

  return (
    <SelectBase
      items={items}
      isOpen={isOpen}
      onOpenChanged={setIsOpen}
      switchOpen={switchOpen}
      {...rest}
    >
      <Typography>
        {items.find((item) => item.key === selectedItem)?.title ?? placeholder}
      </Typography>
    </SelectBase>
  );
}
