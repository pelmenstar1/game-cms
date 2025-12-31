import {
  alternative,
  compose,
  dynamicZone,
  entity,
  repeatable,
  text,
} from 'game-cms';

export default entity({
  id: 'demo::test',
  title: 'Test',
  components: {
    field1: text({
      options: {
        minLength: 3,
      },
    }),
    field2: repeatable(
      alternative(
        text({
          options: {
            minLength: 1,
          },
        })
      )
    ),
    field3: compose({
      inner1: text({
        options: {
          minLength: 3,
        },
      }),
      inner2: text({
        options: {},
      }),
    }),
    field4: dynamicZone({
      option1: {
        title: 'Option 1',
        component: text({
          options: {
            minLength: 1,
          },
        }),
      },
      option2: {
        title: 'Option 2',
        component: compose({
          inner1: text({
            options: {
              minLength: 3,
            },
          }),
        }),
      },
    }),
  },
});
