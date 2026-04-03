import { entity } from 'game-cms';
import {
  compose,
  dropdown,
  entityReference,
  file,
  json,
  number,
  repeatable,
  text,
} from 'game-cms/components';

export default entity({
  title: 'Room',
  components: {
    name: text(),
    background: file({ supportedMimeTypes: ['image/png'] }),
    width: number({ integer: true, min: 1 }),
    height: number({ integer: true, min: 1 }),
    layout: json(),
    traps: repeatable({
      component: compose({
        trap: entityReference({ entityId: 'trap' }),
        x: number(),
        y: number(),
      }),
    }),
    items: repeatable({
      component: compose({
        item: entityReference({ entityId: 'item' }),
        x: number(),
        y: number(),
      }),
    }),
    checkpoints: repeatable({
      component: compose({
        type: dropdown([
          { key: 'start', title: 'Start' },
          { key: 'mid', title: 'Mid' },
          { key: 'end', title: 'End' },
        ]),
        x: number(),
        y: number(),
      }),
    }),
  },
});
