import type { Meta, StoryObj } from '@storybook/react';

import { Table } from '.';

export default {
  component: Table,
} satisfies Meta<typeof Table>;

type Story = StoryObj<typeof Table>;

export const Empty: Story = {
  args: {
    columns: ['Column 1', 'Column 2', 'Column 3'],
    data: [],
  },
};

export const EmptyNumbered: Story = {
  args: {
    numbered: true,
    columns: ['Column 1', 'Column 2', 'Column 3'],
    data: [],
  },
};

export const WithContent: Story = {
  args: {
    columns: ['Column 1', 'Column 2', 'Column 3'],
    data: [
      ['Column 1 value 1', 'Column 2 value 1', 'Column 3 value 1'],
      ['Column 1 value 2', 'Column 2 value 2', 'Column 3 value 2'],
      ['Column 1 value 3', 'Column 2 value 3', 'Column 3 value 3'],
    ],
  },
};

export const WithContentNumbered: Story = {
  args: {
    numbered: true,
    columns: ['Column 1', 'Column 2', 'Column 3'],
    data: [
      ['Column 1 value 1', 'Column 2 value 1', 'Column 3 value 1'],
      ['Column 1 value 2', 'Column 2 value 2', 'Column 3 value 2'],
      ['Column 1 value 3', 'Column 2 value 3', 'Column 3 value 3'],
    ],
  },
};
