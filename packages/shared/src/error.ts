import { isNonNullObject } from './typecheck.js';

export type StackFrame = {
  function?: string;
  file: string;
  line: number;
  column: number;
};

export function isErrorWithCode(value: unknown, code: string) {
  return isNonNullObject(value) && (value as { code?: string }).code === code;
}

const V8_FRAME = /^\s*at (?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?$/;
const MOZ_FRAME = /^(.*?)@(.+?):(\d+):(\d+)$/;

export function parseErrorStack(error: Error): StackFrame[] {
  const { stack } = error;

  const frames: StackFrame[] = [];

  if (stack) {
    for (const raw of stack.split('\n')) {
      const line = raw.trim();
      if (!line) {
        continue;
      }

      const match = V8_FRAME.exec(line) ?? MOZ_FRAME.exec(line);
      if (match) {
        frames.push({
          function: match[1] || undefined,
          file: match[2],
          line: Number(match[3]),
          column: Number(match[4]),
        });
      }
    }
  }

  return frames;
}
