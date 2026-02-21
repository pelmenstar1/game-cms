import { entity } from 'game-cms';
import { text } from 'game-cms/components';

export default entity({
  id: 'demo::test2',
  title: 'Test2',
  components: {
    abc: text(),
  },
});
