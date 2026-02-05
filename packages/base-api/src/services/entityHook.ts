import {
  EntityHookEventName,
  EntityHookEventPayload,
} from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { cms, env, log } from '@game-cms/global';
import { maybePromiseCatch } from '@game-cms/shared';
import { maybeArrayIncludes } from '@game-cms/shared/collections';

function serviceLog() {
  return log().child({ service: 'base::entityHook' });
}

export default service({
  id: 'base::entityHook',
  lifecycle: {
    onInit: () => {
      const hooks = env().config.entity?.hooks ?? [];

      if (hooks.length > 0) {
        const appEvents = cms().service('base::appEvents');

        const invokeHook = <On extends EntityHookEventName>(
          on: On,
          payload: EntityHookEventPayload<On>
        ) => {
          serviceLog().info(`Reacting to event '${on}'`);

          for (const hook of hooks) {
            if (
              maybeArrayIncludes(hook.on, on) &&
              maybeArrayIncludes(hook.target, payload.entityId)
            ) {
              maybePromiseCatch(
                () => hook.handler(payload),
                (error) => {
                  const name = hook.id ? ` '${hook.id}'` : '';
                  const message = `Hook${name} failed with error`;

                  serviceLog().error(error, message);
                }
              );
            }
          }
        };

        appEvents.addHook('base::entity::created', (payload) => {
          invokeHook('created', payload);
        });

        appEvents.addHook('base::entity::updated', (payload) => {
          invokeHook('updated', payload);
        });

        appEvents.addHook('base::entity::deleted', (payload) => {
          invokeHook('deleted', payload);
        });

        appEvents.addHook('base::entity::unpublished', (payload) => {
          invokeHook('unpublished', payload);
        });
      }
    },
  },
});
