import {
  postRequestUrlSource,
  webpageEntityPreview,
} from '@game-cms/entity-previews';
import { threeDModel } from '@game-cms/game-plugin/components';
import { entity } from 'game-cms';

export default entity({
  id: 'demo::test',
  title: 'Test',
  preview: webpageEntityPreview({
    urlSource: postRequestUrlSource('http://localhost:3333'),
  }),
  components: {
    abc: threeDModel(),
  },
});
