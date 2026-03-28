import { entity } from 'game-cms';
import { entityReference, number, text } from 'game-cms/components';

export default entity({
  title: 'Game Config',
  components: {
    title: text(),
    hero: entityReference({ entityId: 'hero' }),
    startingLevel: entityReference({ entityId: 'level' }),
    gravity: number({ min: 0 }),
    defaultLives: number({ integer: true, min: 1 }),
  },
});
