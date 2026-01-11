import { entity } from 'game-cms';
import {
  checkbox,
  date,
  dropdown,
  json,
  number,
  text,
} from 'game-cms/components';

export default entity({
  id: 'demo::test',
  title: 'Test',
  components: {
    abc: number({
      integer: true,
      min: 1,
      max: 5,
    }),
    abc2: text({
      minLength: 1,
    }),
    d: date({
      minDate: '2026-01-01',
    }),
    c: checkbox({
      value: {
        title: 'Choice 1',
      },
      value2: {
        title: 'Choice 2',
      },
    }),
    f: dropdown([
      { key: 'item1', title: 'Item 1' },
      { key: 'item2', title: 'Item 2' },
      { key: 'item3', title: 'Item 3' },
    ]),
    j: json(),
  },
});
