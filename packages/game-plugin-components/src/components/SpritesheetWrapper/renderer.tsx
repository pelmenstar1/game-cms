import { useComponentApi } from '@game-cms/component-api';
import type { ComponentRenderer } from '@game-cms/core';

export const renderer: ComponentRenderer<'game::spritesheet-wrapper'> = ({
  data,
  options,
  error,
  onDataChanged,
}) => {
  const api = useComponentApi();

  const BaseComponent = api.getComponent(options.componentId);

  return (
    <BaseComponent
      data={data}
      options={options}
      error={error}
      onDataChanged={onDataChanged}
    />
  );
};
