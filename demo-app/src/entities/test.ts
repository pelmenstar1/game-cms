import { checkbox, date, entity, number, text } from 'game-cms';

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
  },
});
