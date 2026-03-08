import {
  postRequestUrlSource,
  webpageEntityPreview,
} from '@game-cms/entity-previews';
import { entity } from 'game-cms';
import { file } from 'game-cms/components';

export default entity({
  title: 'Test',
  preview: webpageEntityPreview({
    urlSource: postRequestUrlSource('http://localhost:3333'),
  }),
  components: {
    abc3: file(),
  },
});
