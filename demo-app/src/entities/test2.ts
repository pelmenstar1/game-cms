import { spritesheet } from '@game-cms/game-plugin/components';
import { entity } from 'game-cms';

export default entity({
  title: 'Test2',
  components: {
    abc: spritesheet(),
  },
});
