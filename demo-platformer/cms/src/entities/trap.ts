import { entity } from 'game-cms';
import {
  compose,
  dropdown,
  file,
  number,
  repeatable,
  text,
} from 'game-cms/components';

export default entity({
  title: 'Trap',
  components: {
    name: text(),
    damage: number({ integer: true, min: 0 }),
    behavior: dropdown([
      { key: 'static', title: 'Static' },
      { key: 'moving', title: 'Moving' },
      { key: 'triggered', title: 'Triggered' },
    ]),
    moveRange: number({ min: 0 }),
    moveSpeed: number({ min: 0 }),
    bounceForce: number({ min: 0 }),
    animations: repeatable({
      component: compose({
        state: text(),
        sprite: compose({
          image: file({ supportedMimeTypes: ['image/png'], maxItems: 1 }),
          frameWidth: number({ integer: true, min: 1 }),
          frameHeight: number({ integer: true, min: 1 }),
        }),
      }),
    }),
  },
});
