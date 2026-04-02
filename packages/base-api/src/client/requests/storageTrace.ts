import {
  TraceFileConciseResponse,
  TraceFileOptions,
  TraceFileResponse,
} from '@game-cms/base-core';
import { ToClientType } from '@game-cms/core';
import { json, request, RequestContext, url } from '@game-cms/core/api/client';

type ClientTraceFileResponse<Options extends TraceFileOptions> = ToClientType<
  Options['concise'] extends true ? TraceFileConciseResponse : TraceFileResponse
>;

export function traceFile<Options extends TraceFileOptions>(
  context: RequestContext,
  fileId: string,
  options: Options
) {
  return request(context, {
    url: url({ path: `/storage/file/${fileId}/trace`, search: options }),
    response: json<ClientTraceFileResponse<Options>>(),
  });
}
