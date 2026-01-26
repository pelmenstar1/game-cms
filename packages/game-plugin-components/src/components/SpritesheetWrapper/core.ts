import { componentCore } from '@game-cms/core';

export default componentCore({
  id: 'game::spritesheet-wrapper',
  defaultRawData: (options, context) => {
    return {
      base: context.getDefaultData(options.componentId, options.baseOptions),
    };
  },
  validator: (data, options, context, params) => {
    return context.validate(
      options.componentId,
      data,
      options.baseOptions,
      params
    );
  },
});
