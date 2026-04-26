import { entity } from 'game-cms';
import { file } from 'game-cms/components';

export default entity({
  title: 'Test2',
  components: {
    abc: file(),
  },
});
