import { spriteStripe } from '@game-cms/game-plugin/components';
import { entity } from 'game-cms';
import {
  compose,
  dropdown,
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
        sprite: spriteStripe({
          supportedMimeTypes: ['image/png'],
        }),
      }),
    }),
  },
});
