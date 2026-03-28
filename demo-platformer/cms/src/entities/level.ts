import { entity } from 'game-cms';
import { entityReference, repeatable, text } from 'game-cms/components';

export default entity({
  title: 'Level',
  components: {
    name: text(),
    rooms: repeatable({
      component: entityReference({ entityId: 'room' }),
    }),
  },
});
