import { ApiError, ApiErrorCode } from '@game-cms/core/api';
import { env } from '@game-cms/global';
import { isErrorWithCode } from '@game-cms/shared';
import type { FastifyReply, FastifyRequest } from 'fastify';

export type ErrorResponseBody = {
  message: string;
  code?: ApiErrorCode;
  details?: unknown;
};

type ErrorResponseParserResult = {
  status: number;
  body: ErrorResponseBody;
};

type FastifyValidationError = {
  message: string;
  validation?: string;
};

function getApiStatusCode(error: ApiError) {
  const { code } = error;
  const { statusCodes } = env().api;

  const status = code !== undefined ? statusCodes[code] : undefined;

  return status ?? 400;
}

function getApiErrorResponse(error: ApiError): ErrorResponseParserResult {
  const status = getApiStatusCode(error);

  const { message, code, details } = error;

  return {
    status,
    body: { message, code, details },
  };
}

function getGenericErrorResponse(error: unknown): {
  status: number;
  body: ErrorResponseBody;
} {
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

  return {
    status: 500,
    body: {
      message: 'Internal Server Error',
      code: 'base::server/internalError',
    },
  };
}

function resolveResponseAndStatus(error: unknown) {
  return error instanceof ApiError
    ? getApiErrorResponse(error)
    : getGenericErrorResponse(error);
}

export function errorHandler() {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  return (error: Error, req: FastifyRequest, res: FastifyReply) => {
    req.log.error(error);

    const { status, body } = resolveResponseAndStatus(error);

    res.status(status).send({ error: body });
  };
}
