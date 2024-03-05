import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from './jwt.strategy';

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as TokenPayload;
});
