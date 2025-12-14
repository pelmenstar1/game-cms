import { useState } from 'react';

import preview from '#storybook/preview';

import { Select, type SelectProps } from '.';

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

const meta = preview.meta({ component: SelectWithState });

export const Primary = meta.story({
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
});

export const Disabled = meta.story({
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
});

export const Long = meta.story({
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
});
