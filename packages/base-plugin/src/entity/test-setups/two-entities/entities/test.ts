import { text } from '@game-cms/base-components';
import { entity } from '@game-cms/base-core';

export default entity({
  title: 'Test',
  components: {
    abc: text(),
  },
});
