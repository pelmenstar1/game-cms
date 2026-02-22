import {
  postRequestUrlSource,
  webpageEntityPreview,
} from '@game-cms/entity-previews';
import { entity } from 'game-cms';
import { entityReference } from 'game-cms/components';

export default entity({
  title: 'Test',
  preview: webpageEntityPreview({
    urlSource: postRequestUrlSource('http://localhost:3333'),
  }),
  components: {
    abc2: entityReference({
      entityId: 'test2',
    }),
  },
});
