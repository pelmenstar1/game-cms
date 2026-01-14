import { entity } from 'game-cms';
import { alternative, text } from 'game-cms/components';

export default entity({
  id: 'demo::test',
  title: 'Test',
  components: {
    abc: alternative(text()),
  },
});
