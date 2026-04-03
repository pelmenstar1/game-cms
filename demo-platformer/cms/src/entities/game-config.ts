import { entity } from 'game-cms';
import {
  compose,
  entityReference,
  file,
  number,
  text,
} from 'game-cms/components';

const scene = compose({
  background: file({ supportedMimeTypes: ['image/png'] }),
});

export default entity({
  title: 'Game Config',
  components: {
    title: text(),
    hero: entityReference({ entityId: 'hero' }),
    startingLevel: entityReference({ entityId: 'level' }),
    gravity: number({ min: 0 }),
    defaultLives: number({ integer: true, min: 1 }),
    titleScene: scene,
    scoreScene: scene,
  },
});
