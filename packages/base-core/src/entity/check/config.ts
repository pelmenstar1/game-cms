import { AnyEntityCheck } from './definition.js';

declare module '../config.js' {
  interface EntityConfig {
    checks?: AnyEntityCheck[];
  }
}
