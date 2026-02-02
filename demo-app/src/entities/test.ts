import {
  postRequestUrlSource,
  webpageEntityPreview,
} from '@game-cms/entity-previews';
import { entity } from 'game-cms';
import { compose, file, number, text } from 'game-cms/components';

export default entity({
  id: 'demo::test',
  title: 'Test',
  displayKeys: ['abc', 'abc2'],
  preview: webpageEntityPreview({
    urlSource: postRequestUrlSource('http://localhost:3333'),
  }),
  components: {
    abc: text(),
    abc2: number(),
    abc3: text(),
    abc4: compose({
      abc5: file(),
      abc6: text(),
    }),
  },
});
