import { describe, expect, test } from 'vitest';

import { handleResponseError } from './errors.js';

function createMockResponse(
  status: number,
  responseText: string | null
): Response {
  return new Response(responseText, { status });
}

describe('handleResponseError', () => {
  describe('when unable to get text from response', () => {
    test('throws error', async () => {
      const response = createMockResponse(400, null);
      response.text = () => {
        return Promise.reject(new Error('Failed to read response'));
      };

      await expect(handleResponseError(response)).rejects.toThrow(
        'API error: cannot retrieve message'
      );
    });
  });

  describe('when body is not valid JSON object', () => {
    test('throws ApiError with bodyString', async () => {
      const response = createMockResponse(400, 'plain text error');

      await expect(handleResponseError(response)).rejects.toHaveProperty(
        'message',
        'plain text error'
      );
    });
  });

  describe('when error property is not a non-null object', () => {
    test('throws ApiError with bodyString when error is null', async () => {
      const response = createMockResponse(400, '{"error": null}');

      await expect(handleResponseError(response)).rejects.toHaveProperty(
        'message',
        '{"error": null}'
      );
    });

    test('throws ApiError with bodyString when error is missing', async () => {
      const response = createMockResponse(400, '{"other": "data"}');

      await expect(handleResponseError(response)).rejects.toHaveProperty(
        'message',
        '{"other": "data"}'
      );
    });

    test('throws ApiError with bodyString when error is a string', async () => {
      const response = createMockResponse(400, '{"error": "just a string"}');

      await expect(handleResponseError(response)).rejects.toHaveProperty(
        'message',
        '{"error": "just a string"}'
      );
    });
  });

  describe('when message is not a string', () => {
    test('throws ApiError with bodyString when message is a number', async () => {
      const response = createMockResponse(400, '{"error": {"message": 123}}');

      await expect(handleResponseError(response)).rejects.toHaveProperty(
        'message',
        '{"error": {"message": 123}}'
      );
    });

    test('throws ApiError with bodyString when message is missing', async () => {
      const response = createMockResponse(400, '{"error": {"code": "ERR"}}');

      await expect(handleResponseError(response)).rejects.toHaveProperty(
        'message',
        '{"error": {"code": "ERR"}}'
      );
    });
  });

  describe('when message is a string', () => {
    test('throws ApiError with message and code when both are strings', async () => {
      const response = createMockResponse(
        401,
        '{"error": {"message": "Invalid token", "code": "AUTH_001"}}'
      );

      await expect(handleResponseError(response)).rejects.toMatchObject({
        message: 'Invalid token',
        httpCode: 401,
        code: 'AUTH_001',
      });
    });

    test('throws ApiError with message only when code is not a string', async () => {
      const response = createMockResponse(
        404,
        '{"error": {"message": "User not found", "code": 123}}'
      );

      await expect(handleResponseError(response)).rejects.toMatchObject({
        message: 'User not found',
        httpCode: 404,
        code: undefined,
      });
    });

    test('throws ApiError with message only when code is missing', async () => {
      const response = createMockResponse(
        404,
        '{"error": {"message": "Not found"}}'
      );

      await expect(handleResponseError(response)).rejects.toMatchObject({
        message: 'Not found',
        httpCode: 404,
        code: undefined,
      });
    });
  });
});
