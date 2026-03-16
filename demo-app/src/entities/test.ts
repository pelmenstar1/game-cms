import {
  postRequestUrlSource,
  webpageEntityPreview,
} from '@game-cms/entity-previews';
import { spine } from '@game-cms/game-plugin/components';
import { entity } from 'game-cms';

export default entity({
  title: 'Test',
  preview: webpageEntityPreview({
    urlSource: postRequestUrlSource('http://localhost:3333'),
  }),
  components: {
    abc3: spine(),
  },
});
