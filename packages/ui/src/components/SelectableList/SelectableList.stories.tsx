import { type Key, useState } from 'react';

import preview from '#storybook/preview';

import { Typography } from '../Typography';
import { SelectableList, type SelectableListProps } from '.';

type Item = {
  id: Key;
  title: string;
};

function SelectableListWithState(props: SelectableListProps<Item>) {
  const [selectedItem, setSelectedItem] = useState(props.selectedItem);

  return (
    <SelectableList
      {...props}
      selectedItem={selectedItem}
      onSelect={setSelectedItem}
    />
  );
}

const meta = preview.meta({ component: SelectableListWithState });

const renderTypography = ({ title }: Item) => <Typography>{title}</Typography>;

export const Primary = meta.story({
  args: {
    items: [
      { id: 'item1', title: 'Item 1' },
      { id: 'item2', title: 'Item 2' },
      { id: 'item3', title: 'Item 3' },
    ],
    children: renderTypography,
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    items: [
      { id: 'item1', title: 'Item 1' },
      { id: 'item2', title: 'Item 2' },
      { id: 'item3', title: 'Item 3' },
    ],
    children: renderTypography,
  },
});
