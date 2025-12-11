import type { Meta, StoryObj } from '@storybook/react';
import { range } from 'lodash';
import { useState } from 'react';

import { FileGrid, type FileGridProps, type FileItem } from './FileGrid';

function Component(props: FileGridProps) {
  const [selectedItem, setSelectedItem] = useState<FileItem>();

  return (
    <FileGrid
      {...props}
      selectedItemId={selectedItem?.id}
      onItemSelected={setSelectedItem}
    />
  );
}

export default {
  component: Component,
} satisfies Meta;

type Story = StoryObj<typeof Component>;

function createFile(index: number, thumbnail?: string): FileItem {
  return {
    id: index.toString(),
    name: `File ${index}`,
    size: 100 + index,
    type: 'file',
    thumbnail,
  };
}

export const SingleFile: Story = {
  args: {
    items: [createFile(1)],
  },
};

export const MultipleFiles: Story = {
  args: {
    items: [
      ...range(10).map((i) => createFile(i)),
      createFile(11, 'https://i.imgur.com/OEuYkKXl.png'),
    ],
  },
};
