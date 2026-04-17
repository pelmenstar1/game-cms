import { ApiError, ApiErrorCode, isApiError } from '@game-cms/core/api';
import { env } from '@game-cms/global';
import { isErrorWithCode } from '@game-cms/shared';
import type { FastifyReply, FastifyRequest } from 'fastify';

export type ErrorResponseBody = {
  message: string;
  code?: ApiErrorCode;
  details?: unknown;
};

type ErrorSerializerResult = {
  status: number;
  body: ErrorResponseBody;
};

type FastifyValidationError = {
  message: string;
  validation?: string;
};

type ErrorSerializer = (error: unknown) => ErrorSerializerResult | undefined;

function getApiStatusCode(error: ApiError) {
  const { code } = error;
  const { statusCodes } = env().api;

  const status = code !== undefined ? statusCodes[code] : undefined;

  return status ?? 400;
}

const apiErrorSerializer: ErrorSerializer = (error) => {
  if (isApiError(error)) {
    const { message, code, details } = error;

    return {
      status: getApiStatusCode(error),
      body: { message, code, details },
    };
  }
};

const fastifyValidationErrorSerializer: ErrorSerializer = (error) => {
  if (isErrorWithCode(error, 'FST_ERR_VALIDATION')) {
    const { message, validation } = error as FastifyValidationError;

    return {
      status: 400,
      body: {
        message,
        code: 'base::schema/validation',
        details: validation,
      },
    };
  }
};

const genericErrorSerializer: ErrorSerializer = () => ({
  status: 500,
  body: {
    message: 'Internal Server Error',
    code: 'base::server/internalError',
  },
});

const serializers: ErrorSerializer[] = [
  apiErrorSerializer,
  fastifyValidationErrorSerializer,
  genericErrorSerializer,
];

function resolveResponseAndStatus(error: unknown) {
  for (const serializer of serializers) {
    const result = serializer(error);

    if (result !== undefined) {
      return result;
    }
  }

  throw new Error('No serializer found for error');
}

export function errorHandler() {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  return (error: Error, req: FastifyRequest, res: FastifyReply) => {
    req.log.error(error);

    const { status, body } = resolveResponseAndStatus(error);

    res.status(status).send({ error: body });
  };
}
