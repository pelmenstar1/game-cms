import type { RoutesMeta } from '@game-cms/api/types';


export interface RequestInitWithHeaders extends RequestInit {
  headers: Headers;
}
