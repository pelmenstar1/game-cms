import { entity } from 'game-cms';
import { compose, dropdown, file, number, text } from 'game-cms/components';

export default entity({
  title: 'Item',
  components: {
    name: text(),
    sprite: compose({
      image: file({ supportedMimeTypes: ['image/png'], maxItems: 1 }),
      frameWidth: number({ integer: true, min: 1 }),
      frameHeight: number({ integer: true, min: 1 }),
    }),
    effect: dropdown([
      { key: 'score', title: 'Score' },
      { key: 'heal', title: 'Heal' },
      { key: 'speed_boost', title: 'Speed Boost' },
      { key: 'destroy', title: 'Destroy' },
    ]),
    value: number(),
    collected: file({ supportedMimeTypes: ['image/png'], maxItems: 1 }),
  },
});
