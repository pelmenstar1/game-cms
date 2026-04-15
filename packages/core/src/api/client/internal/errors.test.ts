import { describe, expect, test } from 'vitest';

import { handleResponseError } from './errors.js';

function createMockResponse(
  status: number,
  responseText: string | null
): Response {
  return new Response(responseText, { status });
}

describe('handleResponseError', () => {
  test('throws error when unable to get text from response', async () => {
    const response = createMockResponse(400, null);
    response.text = () => Promise.reject(new Error('Failed to read response'));

    const actual = handleResponseError(response);

    await expect(actual).rejects.toThrow('API error: cannot retrieve message');
  });

  describe('throws ApiError with raw body string', () => {
    test.each([
      ['plain text error'],
      ['{"error": null}'],
      ['{"other": "data"}'],
      ['{"error": "just a string"}'],
      ['{"error": {"message": 123}}'],
      ['{"error": {"code": "ERR"}}'],
    ])('throws ApiError with raw body string', async (responseText) => {
      const response = createMockResponse(400, responseText);
      const actual = handleResponseError(response);

      await expect(actual).rejects.toHaveProperty('message', responseText);
    });
  });

  describe('when message is a string', () => {
    test.each([
      {
        status: 401,
        body: '{"error": {"message": "Invalid token", "code": "AUTH_001"}}',
        expected: { message: 'Invalid token', httpCode: 401, code: 'AUTH_001' },
      },
      {
        status: 404,
        body: '{"error": {"message": "User not found", "code": 123}}',
        expected: { message: 'User not found', httpCode: 404, code: undefined },
      },
      {
        status: 404,
        body: '{"error": {"message": "Not found"}}',
        expected: { message: 'Not found', httpCode: 404, code: undefined },
      },
      {
        status: 400,
        body: '{"error": {"message": "Validation failed", "details": {"field": "email"}}}',
        expected: { message: 'Validation failed', details: { field: 'email' } },
      },
      {
        status: 400,
        body: '{"error": {"message": "Bad request"}}',
        expected: { message: 'Bad request', details: undefined },
      },
    ])('throws ApiError', async ({ status, body, expected }) => {
      const response = createMockResponse(status, body);
      const actual = handleResponseError(response);

      await expect(actual).rejects.toMatchObject(expected);
    });
  });
});
