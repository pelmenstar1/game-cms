import { cms, env } from '@game-cms/global';
import { xxHashFile } from '@game-cms/shared/io';
import { bigintToBuffer } from '@game-cms/shared/node';
import { Binary } from 'bson';

declare module '@game-cms/base-core' {
  interface DatabaseEntityMap {
    'base::configIdentity': { hash: Binary };
  }
}

export const getConfigHashIfChanged = async () => {
  const configPath = './src/cms.config.ts';

  const currentHash = await xxHashFile(configPath);
  const currentHashBuffer = bigintToBuffer(currentHash);

  const identity = await cms()
    .service('base::database')
    .collection('base::configIdentity')
    .findOne();

  if (!(identity && currentHashBuffer.equals(identity.hash.buffer))) {
    return Binary.fromPackedBits(currentHashBuffer);
  }
};

export async function runConfigChangedLifecycleHooksIfNecessary() {
  const hash = await getConfigHashIfChanged();

  if (hash) {
    const { services, config } = env();

    await Promise.all(
      config.plugins.map((plugin) => plugin.onConfigChanged?.())
    );

    await Promise.all(
      services.map((service) => service.lifecycle?.onConfigChanged?.())
    );

    await cms()
      .service('base::database')
      .collection('base::configIdentity')
      .updateOne({}, { $set: { hash } }, { upsert: true });
  }
}
