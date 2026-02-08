import { FastifyPluginCallback } from 'fastify';

const ABORT_CONTROLLER = Symbol('abort-controller');

declare module 'fastify' {
  interface FastifyRequest {
    [ABORT_CONTROLLER]?: AbortController;
    abortSignal?: AbortSignal;
  }
}

export const abortablePlugin: FastifyPluginCallback = (instance) => {
  instance.addHook('onRequest', (req, _, done) => {
    const abortController = new AbortController();

    req[ABORT_CONTROLLER] = abortController;
    req.abortSignal = abortController.signal;

    done();
  });

  instance.addHook('onRequestAbort', (req) => {
    req[ABORT_CONTROLLER]?.abort();
  });
};
