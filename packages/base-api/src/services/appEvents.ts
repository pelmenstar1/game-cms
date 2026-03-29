import { EventEmitter } from 'node:events';

import type { AppEventsRegistry } from '@game-cms/base-core';
import { service } from '@game-cms/core';

type PayloadLessEvents = {
  [K in keyof AppEventsRegistry]: AppEventsRegistry[K] extends undefined
    ? K
    : never;
}[keyof AppEventsRegistry];

type Destructor = () => void;

const eventBus = new EventEmitter();

function emit(name: PayloadLessEvents): void;

function emit<T extends keyof AppEventsRegistry>(
  name: T,
  payload: AppEventsRegistry[T]
): void;

function emit<T extends keyof AppEventsRegistry>(
  name: T,
  payload?: AppEventsRegistry[T]
) {
  eventBus.emit(name, payload);
}

function addHook<T extends keyof AppEventsRegistry>(
  name: T,
  listener: (payload: AppEventsRegistry[T]) => void
): Destructor;

function addHook(name: PayloadLessEvents, listener: () => void): Destructor;

function addHook<T extends keyof AppEventsRegistry>(
  name: T,
  listener: (payload?: AppEventsRegistry[T]) => void
): Destructor {
  eventBus.on(name, listener);

  return () => {
    eventBus.off(name, listener);
  };
}

export default service({
  lifecycle: {},
  emit,
  addHook,
});
