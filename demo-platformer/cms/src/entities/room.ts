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

const checkpointImageVariant = compose({
  file: file({ supportedMimeTypes: ['image/png'], maxItems: 1 }),
  width: number({ integer: true, min: 1 }),
  height: number({ integer: true, min: 1 }),
});

const checkpointImage = compose({
  idle: checkpointImageVariant,
  moving: checkpointImageVariant,
});

export default entity({
  title: 'Room',
  components: {
    name: text(),
    background: file({ supportedMimeTypes: ['image/png'] }),
    width: number({ integer: true, min: 1 }),
    height: number({ integer: true, min: 1 }),
    layout: json(),
    terrain: file({ supportedMimeTypes: ['image/png'] }),
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
    checkpointImages: compose({
      start: checkpointImage,
      mid: checkpointImage,
      end: checkpointImage,
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
