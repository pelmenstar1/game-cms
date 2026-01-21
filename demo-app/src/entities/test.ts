import { entity } from 'game-cms';
import { graph, text } from 'game-cms/components';

export default entity({
  id: 'demo::test',
  title: 'Test',
  components: {
    abc: graph({
      component: text(),
    }),
  },
});
