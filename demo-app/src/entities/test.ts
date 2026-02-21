import {
  postRequestUrlSource,
  webpageEntityPreview,
} from '@game-cms/entity-previews';
import { entity } from 'game-cms';
import { entityReference } from 'game-cms/components';

export default entity({
  id: 'demo::test',
  title: 'Test',
  preview: webpageEntityPreview({
    urlSource: postRequestUrlSource('http://localhost:3333'),
  }),
  components: {
    abc2: entityReference({
      entityId: 'demo::test2',
    }),
  },
});
