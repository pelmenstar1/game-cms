import { spine } from '@game-cms/game-plugin';
import {
  compose,
  dynamicZone,
  dynamicZoneEntry,
  entity,
  file,
  text,
} from 'game-cms';

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
    item2: dynamicZone({
      id: dynamicZoneEntry({
        option: { title: 'Option 1' },
        component: compose({
          nested1: text({
            options: {},
          }),
        }),
      }),
    }),
  },
});
