import { spriteStripe } from '@game-cms/game-plugin/components';
import { entity } from 'game-cms';
import { dropdown, file, number, text } from 'game-cms/components';

export default entity({
  title: 'Item',
  components: {
    name: text(),
    sprite: spriteStripe({
      supportedMimeTypes: ['image/png'],
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
