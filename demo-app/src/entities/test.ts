import { entity } from 'game-cms';
import { text } from 'game-cms/components';

export default entity({
  id: 'demo::test',
  title: 'Test',
  components: {
    abc: text(),
  },
});
