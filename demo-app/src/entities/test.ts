import { entity } from 'game-cms';
import { compose, file, number, text } from 'game-cms/components';

export default entity({
  id: 'demo::test',
  title: 'Test',
  displayKeys: ['abc', 'abc2'],
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
