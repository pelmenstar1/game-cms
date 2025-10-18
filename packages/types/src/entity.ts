import type { ComponentSchema } from './component.js';

export interface EntitySchema {
  id: string;
  compoments: ComponentSchema[];
}
