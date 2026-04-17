import preview from '#storybook/preview.js';

import { FileInfoModal } from './FileInfoModal.js';

const meta = preview.meta({ component: FileInfoModal });

export const LoremIpsum: unknown = meta.story({
  args: {
    item: {
      id: '123',
      mime: 'text/plain',
      name: 'File 123',
      url: '/loremIpsum.txt',
      hidden: false,
      parent: undefined,
      addons: {},
    },
    onClose: () => {},
  },
});

export const NonBreaking: unknown = meta.story({
  args: {
    item: {
      id: '123',
      mime: 'text/plain',
      name: 'File 123',
      url: '/nonBreaking.txt',
      hidden: false,
      parent: undefined,
      addons: {},
    },
    onClose: () => {},
  },
});

export const Json: unknown = meta.story({
  args: {
    item: {
      id: '123',
      mime: 'application/json',
      name: 'File 123',
      url: '/test.json',
      hidden: false,
      parent: undefined,
      addons: {},
    },
    onClose: () => {},
  },
});
