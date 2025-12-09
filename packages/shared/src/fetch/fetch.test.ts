import { describe, expect, test } from 'vitest';

import { FetchError } from './error.js';
import {
  encodeInitBodyToJson,
  ensureOkResponse,
  type ExtendedRequestInit,
  getJsonOrError,
} from './fetch.js';

describe('getJsonOrError', () => {
  test('ok', async () => {
    const object = { abc: 123 };
    const response = Response.json(object);
    const actual = await getJsonOrError(response);

    expect(actual).toEqual(object);
  });

  test('error', async () => {
    const response = new Response(null, {
      status: 400,
      statusText: 'Bad Request',
    });

    await expect(getJsonOrError(response)).rejects.toEqual(
      new FetchError('Bad Request', 400)
    );
  });

  test('error with message', async () => {
    const response = new Response('message', {
      status: 400,
      statusText: 'Bad Request',
    });

    await expect(getJsonOrError(response)).rejects.toEqual(
      new FetchError('Bad Request: message', 400)
    );
  });

  test('error throwing read', async () => {
    const response = new Response('message', {
      status: 400,
      statusText: 'Bad Request',
    });

    response.text = () => Promise.reject(new Error('message'));

    await expect(getJsonOrError(response)).rejects.toEqual(
      new FetchError('Bad Request', 400)
    );
  });
});

describe('ensureOkResponse', () => {
  test('ok', async () => {
    await ensureOkResponse(new Response());
  });

  test('error', async () => {
    const response = new Response(null, {
      status: 400,
      statusText: 'Bad Request',
    });

    await expect(ensureOkResponse(response)).rejects.toEqual(
      new FetchError('Bad Request', 400)
    );
  });
});

describe('encodeInitBodyToJson', () => {
  test('undefined', () => {
    expect(encodeInitBodyToJson(undefined)).toBeUndefined();
  });

  test('non json', () => {
    const init: ExtendedRequestInit = { body: '123' };

    expect(encodeInitBodyToJson(init)).toEqual(init);
  });

  test('json', () => {
    const body = { a: 1, b: 2 };
    const init: ExtendedRequestInit = { json: true, body };
    const actual = encodeInitBodyToJson(init);

    if (actual === undefined) {
      throw new Error('actual is undefined');
    }

    expect(actual.body).toEqual(JSON.stringify(body));
    expect(actual.headers).toEqual(
      new Headers({ 'Content-Type': 'application/json' })
    );
  });

  test('json with headers', () => {
    const body = { a: 1, b: 2 };
    const init: ExtendedRequestInit = {
      json: true,
      body,
      headers: { Header: 'a' },
    };
    const actual = encodeInitBodyToJson(init);

    if (actual === undefined) {
      throw new Error('actual is undefined');
    }

    expect(actual.body).toEqual(JSON.stringify(body));
    expect(actual.headers).toEqual(
      new Headers({ 'Content-Type': 'application/json', Header: 'a' })
    );
  });
});
