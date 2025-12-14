import preview from '#storybook/preview';

import { Table } from '.';

const meta = preview.meta({ component: Table });

export const Empty = meta.story({
  args: {
    columns: ['Column 1', 'Column 2', 'Column 3'],
    data: [],
  },
});

export const EmptyNumbered = meta.story({
  args: {
    numbered: true,
    columns: ['Column 1', 'Column 2', 'Column 3'],
    data: [],
  },
});

export const WithContent = meta.story({
  args: {
    columns: ['Column 1', 'Column 2', 'Column 3'],
    data: [
      ['Column 1 value 1', 'Column 2 value 1', 'Column 3 value 1'],
      ['Column 1 value 2', 'Column 2 value 2', 'Column 3 value 2'],
      ['Column 1 value 3', 'Column 2 value 3', 'Column 3 value 3'],
    ],
  },
});

export const WithContentNumbered = meta.story({
  args: {
    numbered: true,
    columns: ['Column 1', 'Column 2', 'Column 3'],
    data: [
      ['Column 1 value 1', 'Column 2 value 1', 'Column 3 value 1'],
      ['Column 1 value 2', 'Column 2 value 2', 'Column 3 value 2'],
      ['Column 1 value 3', 'Column 2 value 3', 'Column 3 value 3'],
    ],
  },
});
