import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export const REQUEST_ID_HEADER = 'x-request-id';

export function requestContextMiddleware(request: Request, response: Response, next: NextFunction) {
  const incoming = request.header(REQUEST_ID_HEADER);
  const requestId = incoming && /^[a-zA-Z0-9._:-]{1,128}$/.test(incoming) ? incoming : randomUUID();
  response.setHeader(REQUEST_ID_HEADER, requestId);
  (request as Request & { requestId?: string }).requestId = requestId;
  next();
}
