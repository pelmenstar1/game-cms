import { createNewComponent } from '@game-cms/codegen/newComponent';

const componentPath = process.argv[2];

void createNewComponent(import.meta.dirname, componentPath, {
  storybook: true,
  reExport: true,
});
