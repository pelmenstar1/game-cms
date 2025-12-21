import type { Register } from 'react-router';

type ProcessPart<T> = T extends `:${string}` ? string : T;
type BuildUrl<
  First extends string,
  Rest extends string,
> = `${ProcessPart<First>}/${ProcessUrl<Rest>}`;

type ProcessUrl<T> = T extends `${infer First}/${infer Rest}`
  ? Rest extends `:${string}?`
    ? ProcessPart<First> | BuildUrl<First, Rest>
    : BuildUrl<First, Rest>
  : ProcessPart<T>;

type PageUrl = ProcessUrl<keyof Register['pages']> | '/404';

declare module '@game-cms/ui' {
  interface UIOptions {
    url: PageUrl;
  }
}
