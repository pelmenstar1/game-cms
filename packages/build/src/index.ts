export const sharedAssets = {
  react: ['react', 'react-dom', 'react/jsx-runtime'],
} as const;

type SharedAssetsMap = typeof sharedAssets;
export type SharedAssetScope = keyof SharedAssetsMap;

export type ExternalSharedAsset<
  Scope extends SharedAssetScope = SharedAssetScope,
> = SharedAssetsMap[Scope][number];

export type SharedAssetDerivativeMap<T> = {
  [K in SharedAssetScope]: {
    [U in SharedAssetsMap[K][number]]: T;
  };
};

export const SHARED_ASSET_PREFIX = '_s';

export const EXTERNAL_SHARED_ASSETS = Object.values(sharedAssets).flat();
export const SHARED_ASSETS_PATHS = Object.fromEntries(
  Object.entries(sharedAssets).flatMap(([scope, values]) =>
    values.map((name) => [
      name,
      getSharedAssetPath(scope as SharedAssetScope, name),
    ])
  )
);

export const COMPONENT_CLIENT_SUFFIX = '-client';

export function getSharedAssetPath<S extends SharedAssetScope>(
  scope: S,
  name: ExternalSharedAsset<S>
): string {
  return `/assets/${SHARED_ASSET_PREFIX}/${scope}/${name.replaceAll('/', '')}.js`;
}
