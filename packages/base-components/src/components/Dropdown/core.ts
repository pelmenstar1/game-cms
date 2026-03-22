import { defineComponentCore } from '@game-cms/core';

export default defineComponentCore({
  id: 'base::dropdown',
  defaultOutData: ({ items }) => items[0].key,
});
