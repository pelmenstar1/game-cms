import { ComponentRawDataById, defineComponentCore } from '@game-cms/core';

export default defineComponentCore({
  id: 'base::json',
  defaultRawData: <Args>() => ({}) as ComponentRawDataById<'base::json', Args>,
  validator: (data, options) => {
    const { type } = options;
    if (type) {
      const result = type.safeParse(data);
      if (!result.success) {
        return 'INVALID_FORMAT';
      }
    }
  },
});
