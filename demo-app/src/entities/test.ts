import {
  postRequestUrlSource,
  webpageEntityPreview,
} from '@game-cms/entity-previews';
import { entity } from 'game-cms';
import { font } from 'game-cms/components';

export default entity({
  id: 'demo::test',
  title: 'Test',
  preview: webpageEntityPreview({
    urlSource: postRequestUrlSource('http://localhost:3333'),
  }),
  components: {
    abc: font(),
  },
});
