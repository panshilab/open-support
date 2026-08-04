import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { RequestWithUser } from './session.guard';

export const CurrentUser = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<RequestWithUser>();
  return request.user;
});
