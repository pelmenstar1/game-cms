import { AnyEntityHook } from './types.js';

declare module '../config.js' {
  interface EntityConfig {
    hooks?: AnyEntityHook[];
  }
}
