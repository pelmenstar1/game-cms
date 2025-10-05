import type { Meta, StoryObj } from '@storybook/react';
import { Key, useState } from 'react';

import { Typography } from '../Typography';
import { SelectableList, SelectableListProps } from '.';

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

export default {
  component: SelectableListWithState,
} satisfies Meta<typeof SelectableListWithState>;

type Story = StoryObj<typeof SelectableListWithState>;

const renderTypography = ({ title }: Item) => <Typography>{title}</Typography>;

export const Primary: Story = {
  args: {
    items: [
      { id: 'item1', title: 'Item 1' },
      { id: 'item2', title: 'Item 2' },
      { id: 'item3', title: 'Item 3' },
    ],
    children: renderTypography,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    items: [
      { id: 'item1', title: 'Item 1' },
      { id: 'item2', title: 'Item 2' },
      { id: 'item3', title: 'Item 3' },
    ],
    children: renderTypography,
  },
};
