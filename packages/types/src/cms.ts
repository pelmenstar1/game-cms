// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GameCmsServiceMap {}

export interface GameCmsController {
  service<K extends keyof GameCmsServiceMap>(name: K): GameCmsServiceMap[K];
}

declare global {
  const cms: GameCmsController;
}
