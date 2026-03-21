import {
  postRequestUrlSource,
  webpageEntityPreview,
} from '@game-cms/entity-previews';
import { spritesheetPathSource, spritesheetStep } from '@game-cms/game-plugin';
import { assetWrapper } from '@game-cms/game-plugin/components';
import { entity } from 'game-cms';
import { compose, file, repeatable, text } from 'game-cms/components';

export default entity({
  title: 'Test',
  preview: webpageEntityPreview({
    urlSource: postRequestUrlSource('http://localhost:3333'),
  }),
  components: {
    assets: assetWrapper({
      pipeline: [
        spritesheetStep({
          source: spritesheetPathSource({
            bundlePath: 'bundle',
            imagePath: 'image',
            namePath: 'name',
          }),
        }),
      ],
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
