import { spine, spritesheetWrapper } from '@game-cms/game-plugin';
import { compose, dynamicZone, entity, file, repeatable, text } from 'game-cms';

export default entity({
  id: 'demo::test',
  title: 'Test',
  components: {
    assets: spritesheetWrapper({
      imagePath: 'content.[image].file',
      bundlePath: 'bundle',
      namePath: 'name',
      component: repeatable({
        component: compose({
          name: text(),
          bundle: text(),
          content: dynamicZone({
            minItems: 1,
            maxItems: 1,
            options: {
              image: {
                option: { title: 'Image' },
                component: compose({
                  file: file(),
                }),
              },
              spine: {
                option: { title: 'Spine' },
                component: spine(),
              },
            },
          }),
        }),
      }),
    }),
  },
});
