import {
  postRequestUrlSource,
  webpageEntityPreview,
} from '@game-cms/entity-previews';
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
      pipelineId: 'assets',
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
