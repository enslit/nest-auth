import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RequestUserAgentParams } from '../../auth/types/RequestUserAgentParams';

export const UserAgent = createParamDecorator(
  (data: undefined, ctx: ExecutionContext): RequestUserAgentParams => {
    const request: Request = ctx.switchToHttp().getRequest();
    return {
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      hostname: request.hostname,
    };
  },
);
