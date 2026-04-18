import { EntityConfig } from '../config.js';
import { AnyEntityCheck } from './definition.js';

export type EntityCheckConfig = {
  captureStackTrace?: boolean;
};

declare module '../config.js' {
  interface EntityConfig {
    checks?:
      | AnyEntityCheck[]
      | {
          config?: EntityCheckConfig;
          items: AnyEntityCheck[];
        };
  }
}

export function getEntityCheckItems(config: EntityConfig | undefined) {
  const checks = config?.checks;

  if (Array.isArray(checks)) {
    return checks;
  }

  return checks?.items ?? [];
}
