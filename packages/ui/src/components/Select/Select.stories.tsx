import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Select, SelectProps } from '.';

function SelectWithState(props: SelectProps) {
  const [selectedItem, setSelectedItem] = useState(props.selectedItem);

  return (
    <Select
      {...props}
      selectedItem={selectedItem}
      onItemSelected={(item) => {
        setSelectedItem(item);
      }}
    />
  );
}

export default {
  component: SelectWithState,
} satisfies Meta<typeof SelectWithState>;

type Story = StoryObj<typeof SelectWithState>;

export const Primary: Story = {
  args: {
    placeholder: 'Select something',
    style: { width: 'fit-content' },
    items: [
      { key: 'item1', title: 'Item 1' },
      { key: 'item2', title: 'Item 2' },
      {
        key: 'item3',
        title: 'Item 3',
      },
    ],
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Select something',
    disabled: true,
    style: { width: 'fit-content' },
    items: [
      { key: 'item1', title: 'Item 1' },
      { key: 'item2', title: 'Item 2' },
      {
        key: 'item3',
        title: 'Item 3',
      },
    ],
  },
};

export const Long: Story = {
  args: {
    placeholder: 'Select something',
    style: { width: 'fit-content' },
    items: [
      { key: 'item1', title: 'Item 1' },
      { key: 'item2', title: 'Item 2' },
      {
        key: 'item3',
        title: 'Item 3 that is tooooooooooooooooooooooooooooooo long',
      },
    ],
  },
};
