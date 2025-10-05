import { ComponentProps, useCallback, useState } from 'react';

import { SelectBase } from '../SelectBase';
import { Typography } from '../Typography';

export interface SelectProps<T extends string = string>
  extends ComponentProps<'div'> {
  items: { key: T; title: string }[];
  selectedItem?: T;
  placeholder: string;
  disabled?: boolean;

  onItemSelected?: (value: T) => void;
}

export function Select<T extends string>({
  items,
  placeholder,
  selectedItem,
  ...rest
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const switchOpen = useCallback(() => {
    setIsOpen((state) => !state);
  }, []);

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
