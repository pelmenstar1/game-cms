import { spine } from '@game-cms/game-plugin';
import { entity, file } from 'game-cms';

export default entity({
  id: 'demo::test',
  title: 'Test',
  components: {
    item1: file({
      options: {},
    }),
    spine1: spine({
      options: {},
    }),
  },
});
