import { entity } from 'game-cms';
import { compose, file, number, repeatable, text } from 'game-cms/components';

export default entity({
  title: 'Hero',
  components: {
    name: text(),
    folder: text(),
    frameWidth: number({ integer: true, min: 1 }),
    frameHeight: number({ integer: true, min: 1 }),
    hp: number({ integer: true, min: 1 }),
    speed: number({ min: 0 }),
    jumpForce: number({ min: 0 }),
    animations: repeatable({
      component: compose({
        state: text(),
        sprite: file({ supportedMimeTypes: ['image/png'], maxItems: 1 }),
      }),
    }),
  },
});
