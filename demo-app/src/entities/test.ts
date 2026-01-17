import { spritesheetWrapper } from '@game-cms/game-plugin/components';
import { entity } from 'game-cms';
import { compose, file, repeatable, text } from 'game-cms/components';

export default entity({
  id: 'demo::test',
  title: 'Test',
  components: {
    abc: spritesheetWrapper({
      namePath: 'name',
      bundlePath: 'bundle',
      imagePath: 'image',
      component: repeatable({
        component: compose({
          name: text(),
          bundle: text(),
          image: file(),
        }),
      }),
    }),
  },
});
