import { entity } from 'game-cms';
import { number, text } from 'game-cms/components';

export default entity({
  id: 'demo::test',
  title: 'Test',
  components: {
    abc: text(),
    abc2: number(),
  },
});
