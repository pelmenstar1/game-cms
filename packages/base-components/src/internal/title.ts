import { ComponentId, ComponentOutDataById } from '@game-cms/core';

type KeysExtend<T, U> = {
  [K in keyof T & string]: T[K] extends U ? K : never;
}[keyof T & string];

type StringLike = string | number;

export type TitleSpec<K extends string = string> = string | { key: K };

export type TitleSpecFromValue<T> = TitleSpec<KeysExtend<T, StringLike>>;

export type TitleSpecById<Id extends ComponentId, Args> = ComponentId extends Id
  ? TitleSpec
  : TitleSpecFromValue<keyof ComponentOutDataById<Id, Args>>;

export function resolveTitleSpec<T>(
  spec: TitleSpecFromValue<T>,
  value: T
): StringLike {
  return typeof spec === 'string' ? spec : (value[spec.key] as StringLike);
}
